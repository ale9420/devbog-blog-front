<script setup lang="ts">
const { t } = useI18n();
const route = useRoute();
const token = route.query.token as string;

const status = ref<"loading" | "success" | "error">("loading");
const errorMessage = ref("");

const errorCodes: Record<number, string> = {
  400: "alreadyConfirmed",
  404: "invalidToken",
};

async function confirmSubscription() {
  if (!token) {
    status.value = "error";
    errorMessage.value = t("confirm.invalidToken");
    return;
  }

  try {
    await $fetch("/api/newsletter/confirm", {
      method: "GET",
      params: { token },
    });
    status.value = "success";
  } catch (e: any) {
    status.value = "error";
    const statusCode = e.response?.status || e.statusCode;
    errorMessage.value = t(`confirm.${errorCodes[statusCode] || "invalidToken"}`);
  }
}

onMounted(() => {
  confirmSubscription();
});

useSeoMeta({
  title: t("confirm.title"),
});
</script>

<template>
  <div class="min-h-[60vh] flex items-center justify-center px-4">
    <div class="max-w-md w-full text-center">
      <div v-if="status === 'loading'" class="card p-8">
        <UIcon
          name="i-heroicons-arrow-path"
          class="w-12 h-12 mx-auto mb-4 text-[var(--primary)] animate-spin"
        />
        <p class="text-[var(--muted)]">{{ t("common.loading") }}</p>
      </div>

      <div
        v-else-if="status === 'success'"
        class="card p-8"
        style="background-color: var(--success-bg); border-color: var(--success)"
      >
        <UIcon
          name="i-heroicons-check-circle"
          class="w-16 h-16 mx-auto mb-4"
          style="color: var(--success)"
        />
        <h1 class="font-display text-2xl font-bold mb-2">
          {{ t("confirm.successTitle") }}
        </h1>
        <p class="text-[var(--muted)] mb-6">{{ t("confirm.successMessage") }}</p>
        <NuxtLink to="/blog" class="btn-primary inline-block">
          {{ t("confirm.browseBlog") }}
        </NuxtLink>
      </div>

      <div
        v-else
        class="card p-8"
        style="background-color: var(--error-bg); border-color: var(--error)"
      >
        <UIcon
          name="i-heroicons-x-circle"
          class="w-16 h-16 mx-auto mb-4"
          style="color: var(--error)"
        />
        <h1 class="font-display text-2xl font-bold mb-2">
          {{ t("confirm.errorTitle") }}
        </h1>
        <p class="text-[var(--muted)] mb-6">{{ errorMessage }}</p>
        <NuxtLink to="/" class="btn-secondary inline-block">
          {{ t("confirm.goHome") }}
        </NuxtLink>
      </div>
    </div>
  </div>
</template>
