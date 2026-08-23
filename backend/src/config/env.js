import { z } from 'zod'

const envSchema = z.object({
  // ... other environment variables ...
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  GOOGLE_URL: z.string().optional(),
})

export const env = envSchema.parse(process.env)