export interface CommentAuthor {
  id?: string | number
  name: string
  email?: string
  avatar?: string | null
}

export interface Comment {
  id: number
  documentId?: string
  content: string
  blocked: boolean | null
  blockedThread: boolean
  blockReason: string | null
  authorUser: string | null
  removed: boolean | null
  approvalStatus: string | null
  author: CommentAuthor
  createdAt: string
  updatedAt: string
  related: {
    id: number
    documentId?: string
  }
  reports: CommentReport[]
  children?: Comment[]
  threadOf?: {
    id: number
  } | null
}

export interface CommentReport {
  id: number
  reason: 'BAD_WORDS' | 'DISCRIMINATION' | 'OTHER' | string
  content?: string
  createdAt: string
  related?: {
    id: number
  }
}

export interface CommentFormData {
  author: {
    name: string
    email: string
    avatar?: string
  }
  content: string
  threadOf?: number
}

export interface CommentsResponse {
  data: Comment[]
  meta?: {
    pagination?: {
      page: number
      pageSize: number
      pageCount: number
      total: number
    }
  }
}

export interface PostCommentResponse {
  data: Comment
  error?: string
}
