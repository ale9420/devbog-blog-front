import type { DraftFilter, DraftListItem, DraftState, DraftViewState, PublishedVersion } from '../interfaces/draft'

export const DRAFT_FILTERS: readonly DraftFilter[] = ['all', 'never-published', 'modified']

const DRAFT_STATES: readonly DraftState[] = ['never-published', 'modified']

function time(value: string | null | undefined): number {
  const parsed = value ? new Date(value).getTime() : Number.NaN
  return Number.isNaN(parsed) ? 0 : parsed
}

export function isDraftState(value: unknown): value is DraftState {
  return DRAFT_STATES.includes(value as DraftState)
}

export function sortDrafts(drafts: DraftListItem[]): DraftListItem[] {
  return [...drafts].sort((a, b) => time(b.updatedAt) - time(a.updatedAt))
}

export function filterDrafts(drafts: DraftListItem[], filter: DraftFilter): DraftListItem[] {
  return filter === 'all' ? drafts : drafts.filter(draft => draft.state === filter)
}

export function countDrafts(drafts: DraftListItem[], filter: DraftFilter): number {
  return filterDrafts(drafts, filter).length
}

export function draftViewState(draftUpdatedAt: string | null | undefined, published: PublishedVersion | null): DraftViewState {
  if (!published) return 'never-published'
  return time(draftUpdatedAt) > time(published.updatedAt) ? 'modified' : 'unchanged'
}

export function draftStateKey(state: DraftViewState | DraftFilter): string {
  return state.replace(/-(\w)/g, (_, letter: string) => letter.toUpperCase())
}
