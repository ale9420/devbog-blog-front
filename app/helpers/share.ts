const MASTODON_SHARE = 'https://s2f.kytta.dev/'

export function mastodonShareUrl(title: string, url: string): string {
  return `${MASTODON_SHARE}?text=${encodeURIComponent(`${title} ${url}`)}`
}
