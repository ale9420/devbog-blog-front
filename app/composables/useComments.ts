import type { Comment, CommentFormData, CommentsResponse } from '~/interfaces/comment'
import { isFediverseComment } from '~/helpers/comments'

interface GuestCommentPayload {
  author: {
    id: string
    name: string
    email: string
    avatar?: string
  }
  content: string
  threadOf?: number
}

function getErrorMessage(err: unknown, fallback: string): string {
  if (err instanceof Error && err.message) return err.message
  return fallback
}

export function useComments(articleSlug: string, articleDocumentId?: string) {
  
  const relation = computed(() => {
    if (articleDocumentId) {
      return `api::article.article:${articleDocumentId}`
    }
    return `api::article.article:${articleSlug}`
  })

  const allComments = useState<Comment[]>(`comments:${relation.value}`, () => [])
  const loaded = useState<boolean>(`comments-loaded:${relation.value}`, () => false)
  const pending = ref(false)
  const error = ref<string | null>(null)
  const submitting = ref(false)
  const submitError = ref<string | null>(null)
  const submitSuccess = ref(false)

  async function fetchComments() {
    pending.value = true
    error.value = null
    
    try {
      const response = await $fetch<CommentsResponse>(
        `/api/comments/flat?relation=${relation.value}`
      )
      
      allComments.value = response.data || []
      loaded.value = true
    } catch (err: unknown) {
      error.value = getErrorMessage(err, 'Failed to load comments')
      console.error('Error fetching comments:', err)
    } finally {
      pending.value = false
    }
  }

  async function postComment(data: CommentFormData) {
    submitting.value = true
    submitError.value = null
    submitSuccess.value = false
    
    const cleanData: GuestCommentPayload = {
      author: {
        id: `guest-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        name: data.author.name.trim(),
        email: data.author.email.trim()
      },
      content: data.content.trim()
    }
    
    if (data.author.avatar && data.author.avatar.trim()) {
      cleanData.author.avatar = data.author.avatar.trim()
    }
    
    if (data.threadOf) {
      cleanData.threadOf = data.threadOf
    }
    
    try {
      const response = await $fetch(`/api/comments?relation=${relation.value}`, {
        method: 'POST',
        body: cleanData
      })
      
      submitSuccess.value = true
      await fetchComments()
      
      setTimeout(() => {
        submitSuccess.value = false
      }, 3000)
      
      return response
    } catch (err: unknown) {
      submitError.value = getErrorMessage(err, 'Failed to post comment')
      console.error('Error posting comment:', err)
      throw err
    } finally {
      submitting.value = false
    }
  }

  const comments = computed<Comment[]>(() => allComments.value.filter(comment => !comment.threadOf))
  const totalComments = computed<number>(() => allComments.value.length)
  const fediverseReplies = computed<number>(() => allComments.value.filter(isFediverseComment).length)

  function repliesOf(commentId: number): Comment[] {
    return allComments.value.filter(comment => comment.threadOf?.id === commentId)
  }

  return {
    comments,
    pending,
    error,
    totalComments,
    fediverseReplies,
    loaded,
    repliesOf,
    submitting,
    submitError,
    submitSuccess,
    fetchComments,
    postComment
  }
}
