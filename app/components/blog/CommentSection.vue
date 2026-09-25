<script setup lang="ts">
import type { Comment, CommentFilter, CommentFormData } from '~/interfaces/comment'
import { matchesCommentFilter } from '~/helpers/comments'

const FILTERS: CommentFilter[] = ['all', 'blog', 'fediverse']
const MODERATION_RULES: string[] = ['approval', 'edited', 'deleted', 'plainText']

const props = defineProps<{
  slug: string
  documentId?: string
  federated?: boolean
}>()

const { t } = useI18n()

const {
  comments,
  pending,
  error,
  totalComments,
  repliesOf,
  submitting,
  submitError,
  submitSuccess,
  fetchComments,
  postComment
} = useComments(props.slug, props.documentId)
const { openReply } = useFediverseReply(props.documentId ?? props.slug)

const formData = reactive<CommentFormData>({
  author: {
    name: '',
    email: '',
    avatar: ''
  },
  content: '',
  threadOf: undefined
})

const filter = ref<CommentFilter>('all')
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
  } catch {
    return
  }
}

function resetForm() {
  formData.content = ''
  formData.threadOf = undefined
  replyingTo.value = null
  replyingToName.value = ''
}

const countLabel = computed<string>(() => t('comments.count', { count: totalComments.value }, totalComments.value))
const visibleComments = computed<Comment[]>(() => comments.value.filter(comment => matchesCommentFilter(comment, filter.value)))
const emptyLabel = computed<string>(() => {
  if (filter.value === 'fediverse') return t('comments.noFediverseComments')
  if (filter.value === 'blog') return t('comments.noBlogComments')
  return t('comments.noComments')
})

function startReply(comment: Comment) {
  replyingTo.value = comment.id
  replyingToName.value = comment.author?.name || t('post.anonymous')
  formData.threadOf = comment.id
  nextTick(() => {
    const textarea = document.querySelector<HTMLTextAreaElement>('#comment-content')
    textarea?.focus()
  })
}

function selectFilter(value: CommentFilter) {
  filter.value = value
}

function cancelReply() {
  replyingTo.value = null
  replyingToName.value = ''
  formData.threadOf = undefined
}

onMounted(() => {
  fetchComments()
})
</script>

<template>
  <section id="comments" class="bd-comments bd-reveal" aria-labelledby="bd-comments-title">
    <div class="bd-comments-main">
      <div class="bd-home-heading">
        <p class="bd-eyebrow bd-home-eyebrow">{{ countLabel }}</p>
        <h2 id="bd-comments-title" class="bd-home-title bd-stretch">{{ t('comments.title') }}</h2>
        <p class="bd-comments-intro">{{ federated ? t('comments.introFediverse') : t('comments.intro') }}</p>
      </div>

      <div class="bd-comments-filters" role="group" :aria-label="t('comments.filterLabel')">
        <button
          v-for="option in FILTERS"
          :key="option"
          type="button"
          class="bd-chip"
          :aria-pressed="filter === option ? 'true' : 'false'"
          @click="selectFilter(option)"
        >
          {{ t(`comments.filters.${option}`) }}
        </button>
      </div>

      <p v-if="pending" class="bd-meta bd-home-eyebrow" role="status">{{ t('common.loading') }}</p>

      <div v-else-if="error" class="bd-comments-error" role="alert">
        <p>{{ error }}</p>
        <button type="button" class="bd-blog-textbtn" @click="fetchComments">{{ t('common.retry') }}</button>
      </div>

      <p v-else-if="visibleComments.length === 0" class="bd-meta bd-comments-empty">{{ emptyLabel }}</p>

      <div v-else class="bd-comment-list">
        <div v-for="comment in visibleComments" :key="comment.id" class="bd-comment-group">
          <BlogCommentItem :comment="comment" can-reply @reply="startReply" />
          <div v-if="repliesOf(comment.id).length" class="bd-comment-thread">
            <BlogCommentItem v-for="reply in repliesOf(comment.id)" :key="reply.id" :comment="reply" />
          </div>
        </div>
      </div>

      <form class="bd-comment-form" novalidate @submit.prevent="handleSubmit">
        <div class="bd-comment-form-head">
          <p class="bd-eyebrow bd-home-eyebrow">
            {{ replyingTo ? `${t('comments.replyingTo')} ${replyingToName}` : t('comments.leave') }}
          </p>
          <button v-if="replyingTo" type="button" class="bd-blog-textbtn" @click="cancelReply">{{ t('comments.cancel') }}</button>
        </div>

        <p v-if="submitSuccess" class="bd-comment-status bd-comment-status-success" role="status">{{ t('comments.successMessage') }}</p>
        <p v-if="submitError" class="bd-comment-status bd-comment-status-error" role="alert">{{ submitError }}</p>

        <div class="bd-comment-fields">
          <div class="bd-comment-field">
            <label for="author-name">{{ t('comments.name') }}</label>
            <input
              id="author-name"
              v-model="formData.author.name"
              type="text"
              class="bd-comment-input"
              autocomplete="name"
              :placeholder="t('comments.namePlaceholder')"
              :aria-invalid="formErrors.name ? 'true' : undefined"
              :aria-describedby="formErrors.name ? 'author-name-error' : undefined"
            >
            <p v-if="formErrors.name" id="author-name-error" class="bd-comment-error" role="alert">{{ formErrors.name }}</p>
          </div>
          <div class="bd-comment-field">
            <label for="author-email">{{ t('comments.email') }}</label>
            <input
              id="author-email"
              v-model="formData.author.email"
              type="email"
              class="bd-comment-input"
              autocomplete="email"
              :placeholder="t('comments.emailPlaceholder')"
              :aria-invalid="formErrors.email ? 'true' : undefined"
              :aria-describedby="formErrors.email ? 'author-email-error author-email-hint' : 'author-email-hint'"
            >
            <p v-if="formErrors.email" id="author-email-error" class="bd-comment-error" role="alert">{{ formErrors.email }}</p>
            <p id="author-email-hint" class="bd-meta bd-comment-hint">{{ t('comments.emailRequired') }}</p>
          </div>
        </div>

        <div class="bd-comment-field">
          <label for="comment-content">{{ t('comments.comment') }}</label>
          <textarea
            id="comment-content"
            v-model="formData.content"
            rows="5"
            class="bd-comment-input bd-comment-textarea"
            :placeholder="t('comments.placeholder')"
            :aria-invalid="formErrors.content ? 'true' : undefined"
            :aria-describedby="formErrors.content ? 'comment-content-error' : undefined"
          />
          <p v-if="formErrors.content" id="comment-content-error" class="bd-comment-error" role="alert">{{ formErrors.content }}</p>
        </div>

        <div :class="['bd-comment-submit', { 'bd-comment-submit-split': federated }]">
          <button v-if="federated" type="button" class="bd-blog-textbtn" aria-controls="bd-fedi-reply" @click="openReply">
            {{ t('comments.replyFromFediverse') }} <span aria-hidden="true">↗</span>
          </button>
          <BdButton type="submit" arrow :disabled="submitting">
            {{ submitting ? t('comments.posting') : (replyingTo ? t('comments.postReply') : t('comments.postComment')) }}
          </BdButton>
        </div>
      </form>
    </div>

    <aside class="bd-comments-moderation" aria-labelledby="bd-comments-moderation-title">
      <p id="bd-comments-moderation-title" class="bd-eyebrow bd-home-eyebrow">{{ t('comments.moderation.title') }}</p>
      <ul class="bd-meta bd-comments-moderation-list">
        <li v-for="rule in MODERATION_RULES" :key="rule">
          <span class="bd-comments-moderation-check" aria-hidden="true">✓</span>
          {{ t(`comments.moderation.${rule}`) }}
        </li>
      </ul>
    </aside>
  </section>
</template>
