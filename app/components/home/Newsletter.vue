<script setup lang="ts">
const { locale, t } = useI18n();
const config = useRuntimeConfig();

const email = ref("");
const isSubmitting = ref(false);
const isSuccess = ref(false);
const error = ref("");
const pendingState = ref<"confirmation_sent" | "already_subscribed" | null>(null);

async function handleSubmit() {
  if (!email.value) return;

  isSubmitting.value = true;
  error.value = "";
  pendingState.value = null;

  try {
    const response = await $fetch<{ success: boolean; message: string }>(
      "/api/newsletter/subscribe",
      {
        method: "POST",
        body: {
          email: email.value,
          locale: locale.value,
        },
      },
    );

    isSuccess.value = true;
    email.value = "";
    pendingState.value = "confirmation_sent";

    setTimeout(() => {
      isSuccess.value = false;
      pendingState.value = null;
    }, 5000);
  } catch (e: any) {
    const statusCode = e.response?.status || e.statusCode;
    const statusMessage = e.data?.message || e.message || "";

    if (statusCode === 409) {
      error.value = t("newsletter.alreadySubscribed");
      pendingState.value = "already_subscribed";
    } else if (statusMessage.toLowerCase().includes("email")) {
      error.value = t("newsletter.invalidEmail");
    } else {
      error.value = t("newsletter.error");
    }
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<template>
  <section class="card gradient-bogota-subtle p-8 lg:p-12">
    <div class="max-w-2xl mx-auto text-center">
      <UIcon
        name="i-heroicons-envelope"
        class="w-12 h-12 mx-auto mb-4 text-[var(--primary)]"
      />
      <h3 class="font-display text-2xl lg:text-3xl font-bold mb-3">
        {{ t("newsletter.title") }}
      </h3>
      <p class="text-[var(--muted)] mb-6">
        {{ t("newsletter.description") }}
      </p>

      <form
        v-if="!isSuccess && !pendingState"
        @submit.prevent="handleSubmit"
        class="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
      >
        <input
          v-model="email"
          type="email"
          :placeholder="t('newsletter.placeholder')"
          required
          class="input-field flex-1"
          :disabled="isSubmitting"
        />
        <button
          type="submit"
          class="btn-primary whitespace-nowrap"
          :disabled="isSubmitting"
        >
          <UIcon
            v-if="isSubmitting"
            name="i-heroicons-arrow-path"
            class="w-4 h-4 animate-spin"
          />
          <span v-else>{{ t("newsletter.button") }}</span>
        </button>
      </form>

      <div
        v-if="isSuccess || pendingState === 'confirmation_sent'"
        class="rounded-lg p-4"
        style="background-color: var(--success-bg); border: 1px solid var(--success)"
      >
        <UIcon
          name="i-heroicons-check-circle"
          class="w-8 h-8 mx-auto mb-2"
          style="color: var(--success)"
        />
        <p class="font-medium" style="color: var(--success)">
          {{ t("newsletter.confirmationSent") }}
        </p>
        <p class="text-sm text-[var(--muted)] mt-1">
          {{ t("newsletter.checkInbox") }}
        </p>
      </div>

      <div
        v-if="pendingState === 'already_subscribed'"
        class="rounded-lg p-4"
        style="background-color: var(--warning-bg); border: 1px solid var(--warning)"
      >
        <UIcon
          name="i-heroicons-exclamation-triangle"
          class="w-8 h-8 mx-auto mb-2"
          style="color: var(--warning)"
        />
        <p class="font-medium" style="color: var(--warning)">
          {{ t("newsletter.alreadySubscribed") }}
        </p>
      </div>

      <p v-if="error && !pendingState" class="text-sm mt-3" style="color: var(--error)">
        {{ error }}
      </p>
    </div>
  </section>
</template>
