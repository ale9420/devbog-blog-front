<script setup lang="ts">
const { t } = useI18n();
const { searchPosts, getMediaUrl } = useStrapi();
const { localizePath } = useLocaleUtils();

const props = defineProps<{
  isOpen: boolean;
}>();

const emit = defineEmits<{
  close: [];
}>();

const searchInput = ref<HTMLInputElement>();
const query = ref("");
const results = ref<any[]>([]);
const isLoading = ref(false);
const selectedIndex = ref(-1);
let debounceTimer: ReturnType<typeof setTimeout>;

watch(
  () => props.isOpen,
  (isOpen) => {
    if (isOpen) {
      nextTick(() => searchInput.value?.focus());
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      query.value = "";
      results.value = [];
      selectedIndex.value = -1;
    }
  },
);

watch(query, (newQuery) => {
  clearTimeout(debounceTimer);
  if (newQuery.length > 2) {
    isLoading.value = true;
    debounceTimer = setTimeout(async () => {
      try {
        results.value = await searchPosts(newQuery);
        selectedIndex.value = results.value.length > 0 ? 0 : -1;
      } catch (error) {
        console.error("Search error:", error);
        results.value = [];
        selectedIndex.value = -1;
      } finally {
        isLoading.value = false;
      }
    }, 300);
  } else {
    results.value = [];
    selectedIndex.value = -1;
  }
});

function handleKeydown(e: KeyboardEvent) {
  if (!props.isOpen || results.value.length === 0) return;

  if (e.key === "ArrowDown") {
    e.preventDefault();
    selectedIndex.value = (selectedIndex.value + 1) % results.value.length;
  } else if (e.key === "ArrowUp") {
    e.preventDefault();
    selectedIndex.value =
      selectedIndex.value <= 0
        ? results.value.length - 1
        : selectedIndex.value - 1;
  } else if (e.key === "Enter" && selectedIndex.value >= 0) {
    e.preventDefault();
    const selected = results.value[selectedIndex.value];
    if (selected) {
      navigateTo(`${localizePath("/blog")}/${selected.slug}`);
      emit("close");
    }
  }
}

onMounted(() => {
  const handleGlobalKeydown = (e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "k") {
      e.preventDefault();
      emit("close");
    }
  };

  window.addEventListener("keydown", handleGlobalKeydown);
  onUnmounted(() => window.removeEventListener("keydown", handleGlobalKeydown));
});
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="isOpen"
        class="fixed inset-0 z-[70] flex items-start justify-center pt-[15vh]"
      >
        <div
          class="absolute inset-0 backdrop-blur-sm"
          style="background-color: color-mix(in srgb, var(--foreground) 60%, transparent)"
          @click="emit('close')"
        />
        <div class="relative w-full max-w-2xl mx-4 animate-slide-up">
          <div
            class="bg-[var(--surface)] rounded-2xl shadow-2xl overflow-hidden"
          >
            <div
              class="flex items-center gap-3 px-6 py-4 border-b border-[var(--border)]"
            >
              <UIcon
                name="i-heroicons-magnifying-glass"
                class="w-5 h-5 text-[var(--muted)]"
              />
              <input
                ref="searchInput"
                v-model="query"
                type="text"
                :placeholder="t('blog.search')"
                class="flex-1 bg-transparent text-lg outline-none text-[var(--foreground)] placeholder:text-[var(--muted)]"
                @keydown.escape="emit('close')"
                @keydown="handleKeydown"
              />
              <kbd
                class="hidden sm:inline-flex items-center gap-1 px-2 py-1 text-xs rounded bg-[var(--surface-elevated)] text-[var(--muted)]"
              >
                <span class="text-[10px]">{{ t("search.esc") }}</span>
              </kbd>
            </div>

            <div class="max-h-[60vh] overflow-y-auto">
              <div
                v-if="isLoading"
                class="flex items-center justify-center py-12"
              >
                <UIcon
                  name="i-heroicons-arrow-path"
                  class="w-6 h-6 animate-spin text-[var(--primary)]"
                />
              </div>

              <div
                v-else-if="results.length > 0"
                id="search-results"
                role="listbox"
                class="py-2"
              >
                <NuxtLink
                  v-for="(result, index) in results"
                  :key="result.id"
                  :to="`${localizePath('/blog')}/${result.slug}`"
                  role="option"
                  :aria-selected="selectedIndex === index"
                  :aria-label="result.title"
                  @click="emit('close')"
                  class="flex items-start gap-4 px-6 py-4 hover:bg-[var(--surface-elevated)] transition-colors"
                  :class="{
                    'bg-[var(--surface-elevated)]': selectedIndex === index,
                  }"
                >
                  <div
                    v-if="result.cover?.url"
                    class="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0"
                  >
                    <NuxtImg
                      :src="getMediaUrl(result.cover.url)"
                      :alt="result.title"
                      width="64"
                      height="64"
                      format="webp"
                      loading="lazy"
                      class="w-full h-full object-cover"
                    />
                  </div>
                  <div
                    v-else
                    class="w-16 h-16 rounded-lg gradient-bogota-subtle flex items-center justify-center flex-shrink-0"
                  >
                    <UIcon
                      name="i-heroicons-document-text"
                      class="w-6 h-6 text-[var(--muted)]"
                    />
                  </div>
                  <div class="flex-1 min-w-0">
                    <h4
                      class="font-medium text-[var(--foreground)] line-clamp-1"
                    >
                      {{ result.title }}
                    </h4>
                    <p class="text-sm text-[var(--muted)] line-clamp-2 mt-1">
                      {{ result.description }}
                    </p>
                    <div v-if="result.category" class="mt-2">
                      <span
                        class="text-xs px-2 py-0.5 rounded-full bg-[var(--primary)]/10 text-[var(--primary)]"
                      >
                        {{ result.category.name }}
                      </span>
                    </div>
                  </div>
                </NuxtLink>
              </div>

              <div
                v-else-if="query.length > 2"
                class="flex flex-col items-center justify-center py-12 text-center"
              >
                <UIcon
                  name="i-heroicons-magnifying-glass"
                  class="w-12 h-12 text-[var(--muted)] mb-4"
                />
                <p class="text-[var(--muted)]">
                  {{ t("search.noResults", { query }) }}
                </p>
              </div>

              <div v-else class="py-8 text-center text-[var(--muted)]">
                <p>{{ t("search.typeToSearch") }}</p>
              </div>
            </div>

            <div
              class="px-6 py-3 border-t border-[var(--border)] bg-[var(--surface-elevated)]"
            >
              <div
                class="flex items-center justify-between text-xs text-[var(--muted)]"
              >
                <div class="flex items-center gap-4">
                  <span class="flex items-center gap-1">
                    <kbd
                      class="px-1.5 py-0.5 rounded bg-[var(--surface)] border border-[var(--border)]"
                      >↑</kbd
                    >
                    <kbd
                      class="px-1.5 py-0.5 rounded bg-[var(--surface)] border border-[var(--border)]"
                      >↓</kbd
                    >
                    {{ t("search.navigate") }}
                  </span>
                  <span class="flex items-center gap-1">
                    <kbd
                      class="px-1.5 py-0.5 rounded bg-[var(--surface)] border border-[var(--border)]"
                      >↵</kbd
                    >
                    {{ t("search.select") }}
                  </span>
                </div>
                <span>{{ t("search.poweredBy") }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>
