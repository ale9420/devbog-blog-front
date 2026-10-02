import type { H3Event } from 'h3'
import type { z } from 'zod'

export async function validBody<Schema extends z.ZodType>(event: H3Event, schema: Schema, invalid: (error: z.ZodError) => Error): Promise<z.output<Schema>> {
  const body = await readBody<unknown>(event).catch(() => null)
  const result = schema.safeParse(body && typeof body === 'object' ? body : {})
  if (!result.success) throw invalid(result.error)
  return result.data
}
