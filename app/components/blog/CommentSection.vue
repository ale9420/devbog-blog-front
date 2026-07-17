<script setup lang="ts">
import type { Comment, CommentFormData } from '~/interfaces/comment'
const { t } = useI18n()

const props = defineProps<{
  slug: string
  documentId?: string
}>()

const {
  comments,
  pending,
  error,
  totalComments,
  submitting,
  submitError,
  submitSuccess,
  fetchComments,
  postComment
} = useComments(props.slug, props.documentId)

const formData = reactive<CommentFormData>({
  author: {
    name: '',
    email: '',
    avatar: ''
  },
  content: '',
  threadOf: undefined
})

const replyingTo = ref<number | null>(null)
const replyingToName = ref<string>('')
const formErrors = reactive({
  name: '',
  email: '',
  content: ''
})

function validateForm(): boolean {
  let isValid = true
  formErrors.name = ''
  formErrors.email = ''
  formErrors.content = ''

  if (!formData.author.name.trim()) {
    formErrors.name = t('comments.validationName')
    isValid = false
  }

  if (!formData.author.email.trim()) {
    formErrors.email = t('comments.validationEmail')
    isValid = false
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.author.email)) {
    formErrors.email = t('comments.validationInvalidEmail')
    isValid = false
  }

  if (!formData.content.trim()) {
    formErrors.content = t('comments.validationComment')
    isValid = false
  }

  return isValid
}

async function handleSubmit() {
  if (!validateForm()) return

  try {
    await postComment({ ...formData })
    resetForm()
  } catch (err) {
    // Error handled by composable
  }
}

function resetForm() {
  formData.content = ''
  formData.threadOf = undefined
  replyingTo.value = null
  replyingToName.value = ''
}

function startReply(commentId: number, authorName: string) {
  replyingTo.value = commentId
  replyingToName.value = authorName
  formData.threadOf = commentId
  nextTick(() => {
    const textarea = document.querySelector<HTMLTextAreaElement>('#comment-content')
    textarea?.focus()
  })
}

function cancelReply() {
  replyingTo.value = null
  replyingToName.value = ''
  formData.threadOf = undefined
}

function getReplies(commentId: number): Comment[] {
  return comments.value.filter(c => c.threadOf?.id === commentId)
}

onMounted(() => {
  fetchComments()
})
</script>

<template>
  <section class="mt-12 pt-8 border-t border-[var(--border)]">
    <h3 class="font-display text-xl font-semibold mb-6">
      {{ t('comments.title') }} <span class="text-[var(--muted)] font-normal">({{ totalComments }})</span>
    </h3>

    <div v-if="pending" class="space-y-4">
      <div v-for="i in 3" :key="i" class="animate-pulse">
        <div class="flex gap-4">
          <div class="w-10 h-10 rounded-full bg-[var(--surface-elevated)]"></div>
          <div class="flex-1 space-y-2">
            <div class="h-4 bg-[var(--surface-elevated)] rounded w-1/4"></div>
            <div class="h-4 bg-[var(--surface-elevated)] rounded w-3/4"></div>
            <div class="h-4 bg-[var(--surface-elevated)] rounded w-1/2"></div>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="error" class="p-4 rounded-lg mb-6" style="background-color: var(--error-bg); color: var(--error)">
      <p>{{ error }}</p>
      <button 
        @click="fetchComments" 
        class="text-sm underline mt-2 hover:no-underline"
      >
        {{ t('common.retry') }}
      </button>
    </div>

    <div v-else-if="comments.length === 0" class="text-center py-8 text-[var(--muted)]">
      <UIcon name="i-heroicons-chat-bubble-left-right" class="w-12 h-12 mx-auto mb-4 opacity-50" />
      <p>{{ t('comments.noComments') }}</p>
    </div>

    <div v-else class="space-y-6">
      <article 
        v-for="comment in comments" 
        :key="comment.id"
        class="comment-thread"
      >
        <div class="flex gap-4">
          <SharedAuthorAvatar
            :name="comment.author?.name"
            :avatar="comment.author?.avatar"
          />
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2 mb-1">
              <span class="font-medium">{{ comment.author?.name || t('post.anonymous') }}</span>
              <span class="text-xs text-[var(--muted)]">{{ formatRelativeTime(comment.createdAt) }}</span>
            </div>
            <p class="text-[var(--foreground)] whitespace-pre-wrap">{{ comment.content }}</p>
            <div class="mt-2">
              <button 
                v-if="!comment.blockedThread"
                @click="startReply(comment.id, comment.author?.name || t('post.anonymous'))"
                class="text-sm text-[var(--muted)] hover:text-[var(--primary)] transition-colors"
              >
                {{ t('comments.reply') }}
              </button>
            </div>

            <div v-if="getReplies(comment.id).length > 0" class="mt-4 pl-4 border-l-2 border-[var(--border)] space-y-4">
              <article 
                v-for="reply in getReplies(comment.id)" 
                :key="reply.id"
                class="flex gap-3"
              >
                <SharedAuthorAvatar
                  :name="reply.author?.name"
                  :avatar="reply.author?.avatar"
                  size="sm"
                />
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 mb-1">
                    <span class="font-medium text-sm">{{ reply.author?.name || t('post.anonymous') }}</span>
                    <span class="text-xs text-[var(--muted)]">{{ formatRelativeTime(reply.createdAt) }}</span>
                  </div>
                  <p class="text-sm text-[var(--foreground)] whitespace-pre-wrap">{{ reply.content }}</p>
                </div>
              </article>
            </div>
          </div>
        </div>
      </article>
    </div>

    <div class="mt-8">
      <h4 class="font-semibold mb-4">
        {{ replyingTo ? `${t('comments.replyingTo')} ${replyingToName}` : t('comments.placeholder') }}
      </h4>

      <div v-if="submitSuccess" class="p-4 rounded-lg mb-4" style="background-color: var(--success-bg); color: var(--success)">
        {{ t('comments.successMessage') }}
      </div>

      <div v-if="submitError" class="p-4 rounded-lg mb-4" style="background-color: var(--error-bg); color: var(--error)">
        {{ submitError }}
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div v-if="replyingTo" class="flex items-center gap-2 text-sm text-[var(--muted)] mb-4">
          <span>{{ t('comments.replyingTo') }} {{ replyingToName }}</span>
          <button 
            type="button" 
            @click="cancelReply"
            class="text-[var(--primary)] hover:underline"
          >
            {{ t('comments.cancel') }}
          </button>
        </div>

        <div class="grid sm:grid-cols-2 gap-4">
          <div>
            <label for="author-name" class="block text-sm font-medium mb-1">{{ t('comments.name') }} *</label>
            <input 
              id="author-name"
              v-model="formData.author.name"
              type="text"
              class="input-field"
              :style="formErrors.name ? { borderColor: 'var(--error)' } : {}"
              :placeholder="t('comments.namePlaceholder')"
            />
            <p v-if="formErrors.name" class="text-sm mt-1" style="color: var(--error)">{{ formErrors.name }}</p>
          </div>
          <div>
            <label for="author-email" class="block text-sm font-medium mb-1">{{ t('comments.email') }} *</label>
            <input 
              id="author-email"
              v-model="formData.author.email"
              type="email"
              class="input-field"
              :style="formErrors.email ? { borderColor: 'var(--error)' } : {}"
              :placeholder="t('comments.emailPlaceholder')"
            />
            <p v-if="formErrors.email" class="text-sm mt-1" style="color: var(--error)">{{ formErrors.email }}</p>
            <p class="text-xs text-[var(--muted)] mt-1">{{ t('comments.emailRequired') }}</p>
          </div>
        </div>

        <div>
          <label for="comment-content" class="block text-sm font-medium mb-1">{{ t('comments.comment') }} *</label>
          <textarea 
            id="comment-content"
            v-model="formData.content"
            rows="4"
              class="input-field resize-none"
              :style="formErrors.content ? { borderColor: 'var(--error)' } : {}"
              :placeholder="t('comments.placeholder')"
            />
            <p v-if="formErrors.content" class="text-sm mt-1" style="color: var(--error)">{{ formErrors.content }}</p>
        </div>

        <button 
          type="submit" 
          class="btn-primary"
          :disabled="submitting"
        >
          <UIcon v-if="submitting" name="i-heroicons-arrow-path" class="w-4 h-4 animate-spin mr-2" />
          {{ submitting ? t('comments.posting') : (replyingTo ? t('comments.postReply') : t('comments.postComment')) }}
        </button>
      </form>
    </div>
  </section>
</template>
