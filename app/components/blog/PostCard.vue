<script setup lang="ts">
import { formatDate } from '~/helpers/formatDate'

const { t } = useI18n();
const { getMediaUrl } = useStrapi();
const { localizePath } = useLocaleUtils();

const props = defineProps<{
  post: {
    id: number;
    title: string;
    description?: string;
    slug: string;
    publishedAt?: string;
    readTime?: number;
    author?: { name?: string; avatar?: { url: string } };
    category?: { name?: string };
    cover?: { url: string };
  };
  index?: number;
}>();

const delay = computed(() => `${(props.index ?? 0) * 100}ms`);
</script>

<template>
  <NuxtLink :to="`${localizePath('/blog')}/${post.slug}`" class="group block">
    <article
      class="card overflow-hidden h-full flex flex-col opacity-0 animate-slide-up"
      :style="{ animationDelay: delay }"
    >
      <div class="relative aspect-[16/10] overflow-hidden">
        <NuxtImg
          v-if="post.cover?.url"
          :src="getMediaUrl(post.cover.url)"
          :alt="post.title"
          width="600"
          height="375"
          format="webp"
          loading="lazy"
          class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div
          v-else
          class="w-full h-full gradient-bogota-subtle flex items-center justify-center"
        >
          <span class="text-6xl font-display font-bold text-[var(--border)]"
            >{{ post.title?.charAt(0) }}!!!</span
          >
        </div>
        <div
          class="absolute inset-0 bg-gradient-to-t from-[var(--foreground)]/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
        ></div>
        <div v-if="post.category" class="absolute top-4 left-4">
          <span
            class="px-3 py-1.5 text-xs font-semibold rounded-full"
            style="background-color: color-mix(in srgb, var(--primary) 15%, transparent); color: var(--primary)"
          >
            {{ post.category.name }}
          </span>
        </div>
      </div>

      <div class="flex-1 flex flex-col p-5">
        <h3
          class="font-display text-xl font-semibold mb-3 line-clamp-2 group-hover:text-[var(--primary)] transition-colors"
        >
          {{ post.title }}
        </h3>
        <p class="text-[var(--muted)] text-sm line-clamp-3 flex-1">
          {{ post.description }}
        </p>

        <div
          class="flex items-center justify-between mt-4 pt-4 border-t border-[var(--border)]"
        >
          <div class="flex items-center gap-2">
            <SharedAuthorAvatar
              :name="post.author?.name"
              :avatar="post.author?.avatar"
              size="sm"
            />
            <div class="text-sm">
              <p class="font-medium text-[var(--foreground)]">
                {{ post.author?.name || t("post.anonymous") }}
              </p>
              <p class="text-xs text-[var(--muted)]">
                {{ formatDate(post.publishedAt) }}
              </p>
            </div>
          </div>
          <div
            v-if="post.readTime"
            class="flex items-center gap-1 text-xs text-[var(--muted)]"
          >
            <UIcon name="i-heroicons-clock" class="w-4 h-4" />
            {{ t("post.minRead", { minutes: post.readTime }) }}
          </div>
        </div>
      </div>
    </article>
  </NuxtLink>
</template>
