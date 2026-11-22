import { runWithZodQueryCoercion } from 'vona';
import z from 'zod';

// Configuration is JSON/code truth, not an HTTP query string. In particular, null
// must not become an omitted optional value through Vona's query coercion adapter.
export function parseAiConfiguration<T extends z.ZodType>(schema: T, value: unknown): z.output<T> {
  return runWithZodQueryCoercion(false, () => schema.parse(value));
}

const generation = z
  .object({
    maxOutputTokens: z.number().int().positive().optional(),
    temperature: z.number().min(0).max(2).optional(),
    topP: z.number().min(0).max(1).optional(),
    topK: z.number().int().nonnegative().optional(),
    presencePenalty: z.number().min(-2).max(2).optional(),
    frequencyPenalty: z.number().min(-2).max(2).optional(),
    stopSequences: z.array(z.string()).optional(),
    seed: z.number().int().optional(),
    reasoning: z
      .enum(['provider-default', 'none', 'minimal', 'low', 'medium', 'high', 'xhigh', 'max'])
      .optional(),
  })
  .strict();
const request = z
  .object({
    maxRetries: z.number().int().nonnegative().max(10).optional(),
    timeout: z.number().int().positive().optional(),
    headers: z.record(z.string(), z.string()).optional(),
  })
  .strict();
const options = z
  .object({
    baseURL: z.url().optional(),
    apiKey: z.string().min(1).optional(),
    headers: z.record(z.string(), z.string()).optional(),
  })
  .catchall(z.unknown());
export const aiProviderSchema = z
  .object({
    factory: z.string().min(1).optional(),
    enabled: z.boolean().optional(),
    options: options.optional(),
  })
  .strict();
export const aiModelSchema = z
  .object({
    provider: z.string().min(1).optional(),
    modelId: z.string().min(1).optional(),
    enabled: z.boolean().optional(),
    generation: generation.optional(),
    request: request.optional(),
    providerOptions: z.record(z.string(), z.record(z.string(), z.json())).optional(),
  })
  .strict();
export const aiSceneSchema = aiModelSchema
  .omit({ provider: true, modelId: true })
  .extend({
    aiModel: z.string().min(1).optional(),
    instructions: z.string().optional(),
    limits: z
      .object({
        maxInputCharacters: z.number().int().positive().optional(),
        maxOutputTokens: z.number().int().positive().optional(),
        timeoutMs: z.number().int().positive().optional(),
      })
      .strict()
      .optional(),
  })
  .strict();
export const aiCallOverridesSchema = aiSceneSchema.omit({ enabled: true, limits: true });
export const aiConfigNameSchema = z
  .string()
  .min(1)
  .max(100)
  .regex(/^[\w:.-]+$/);

// Database documents are JSON data. Only provider documents may store a plaintext
// credential, at the exact root options.apiKey path; model/scene documents may not.
export function assertAiDatabaseDocument(
  value: unknown,
  mode: 'generic' | 'provider' = 'generic',
): void {
  parseAiConfiguration(z.json(), value);
  function visit(item: unknown, path: string[] = [], inHeaders = false): void {
    if (!item || typeof item !== 'object') return;
    for (const [key, child] of Object.entries(item)) {
      const normalized = key.replace(/[-_]/g, '').toLowerCase();
      const providerApiKey =
        mode === 'provider' && path.length === 1 && path[0] === 'options' && key === 'apiKey';
      if (
        !providerApiKey &&
        /apikey|secret|password|credential|authorization|cookie|^(access|refresh|auth|bearer)?token$/.test(
          normalized,
        )
      ) {
        throw new Error('AI_DATABASE_SECRET_FORBIDDEN');
      }
      if (inHeaders && !['accept', 'content-type', 'user-agent'].includes(key.toLowerCase())) {
        throw new Error('AI_DATABASE_SECRET_HEADER_FORBIDDEN');
      }
      if (normalized === 'baseurl' && typeof child === 'string') {
        const url = new URL(child);
        if (url.username || url.password || url.search || url.hash)
          throw new Error('AI_DATABASE_SECRET_URL_FORBIDDEN');
      }
      visit(child, [...path, key], normalized === 'headers');
    }
  }
  visit(value);
}
