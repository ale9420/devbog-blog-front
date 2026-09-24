export type Category = 'privacidad' | 'diy' | 'ia' | 'software' | 'linux'

export type ButtonVariant = 'primary' | 'secondary' | 'accent' | 'text'

export type ButtonSize = 'md' | 'sm'

export type LogoVariant = 'auto' | 'color' | 'blanco' | 'negro'

export type CalloutTone = 'nota' | 'aviso' | 'peligro'

export interface CodeLine {
  prompt: boolean
  text: string
}

export interface LogoPath {
  part: 'a' | 'b'
  d: string
}
