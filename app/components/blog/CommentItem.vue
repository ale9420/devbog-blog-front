<script setup lang="ts">
import type { Comment } from '~/interfaces/comment'
import { formatDotDate } from '~/helpers/formatDate'

const props = defineProps<{
  comment: Comment
  canReply?: boolean
}>()

const emit = defineEmits<{
  reply: [comment: Comment]
}>()

const { t } = useI18n()

const name = computed<string>(() => props.comment.author?.name || t('post.anonymous'))
</script>

<template>
  <article class="bd-comment">
    <BlogAuthorBadge :author="{ name }" />
    <div class="bd-comment-body">
      <header class="bd-comment-head">
        <span class="bd-comment-name">{{ name }}</span>
        <time class="bd-meta bd-comment-date" :datetime="comment.createdAt">{{ formatDotDate(comment.createdAt) }}</time>
      </header>
      <p v-if="comment.removed" class="bd-comment-text bd-comment-removed">{{ t('comments.removed') }}</p>
      <p v-else class="bd-comment-text">{{ comment.content }}</p>
      <div v-if="canReply && !comment.blockedThread" class="bd-comment-actions">
        <button type="button" class="bd-blog-textbtn" @click="emit('reply', comment)">{{ t('comments.reply') }}</button>
      </div>
    </div>
  </article>
</template>
