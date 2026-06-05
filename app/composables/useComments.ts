import type { Comment, CommentFormData, CommentsResponse } from '~/interfaces/comment'

export function useComments(articleSlug: string, articleDocumentId?: string) {
  const config = useRuntimeConfig()
  
  const relation = computed(() => {
    if (articleDocumentId) {
      return `api::article.article:${articleDocumentId}`
    }
    return `api::article.article:${articleSlug}`
  })

  const comments = ref<Comment[]>([])
  const pending = ref(false)
  const error = ref<string | null>(null)
  const submitting = ref(false)
  const submitError = ref<string | null>(null)
  const submitSuccess = ref(false)

  async function fetchComments() {
    pending.value = true
    error.value = null
    
    try {
      const response = await $fetch<{ data: Comment[]; meta?: any }>(
        `/api/comments/flat?relation=${relation.value}`
      )
      
      const allComments = response.data || []
      comments.value = allComments.filter(c => !c.threadOf)
    } catch (err: any) {
      error.value = err.message || 'Failed to load comments'
      console.error('Error fetching comments:', err)
    } finally {
      pending.value = false
    }
  }

  async function postComment(data: CommentFormData) {
    submitting.value = true
    submitError.value = null
    submitSuccess.value = false
    
    const cleanData: any = {
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
    } catch (err: any) {
      submitError.value = err.message || 'Failed to post comment'
      console.error('Error posting comment:', err)
      throw err
    } finally {
      submitting.value = false
    }
  }

  function countComments(commentList: Comment[]): number {
    let count = 0
    for (const comment of commentList) {
      count++
      if (comment.children && comment.children.length > 0) {
        count += countComments(comment.children)
      }
    }
    return count
  }

  const totalComments = computed(() => countComments(comments.value))

  return {
    comments,
    pending,
    error,
    totalComments,
    submitting,
    submitError,
    submitSuccess,
    fetchComments,
    postComment
  }
}

export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffSecs = Math.floor(diffMs / 1000)
  const diffMins = Math.floor(diffSecs / 60)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)
  const diffWeeks = Math.floor(diffDays / 7)
  const diffMonths = Math.floor(diffDays / 30)
  const diffYears = Math.floor(diffDays / 365)

  if (diffSecs < 60) return 'just now'
  if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`
  if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`
  if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`
  if (diffWeeks < 4) return `${diffWeeks} week${diffWeeks !== 1 ? 's' : ''} ago`
  if (diffMonths < 12) return `${diffMonths} month${diffMonths !== 1 ? 's' : ''} ago`
  return `${diffYears} year${diffYears !== 1 ? 's' : ''} ago`
}
