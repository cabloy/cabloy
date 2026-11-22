import { createOpenAICompatible } from '@ai-sdk/openai-compatible';

import type { TypeAiProviderFactory } from '../types/config.ts';

export const openaiCompatibleFactory: TypeAiProviderFactory = options => {
  const { baseURL } = options;
  if (typeof baseURL !== 'string' || !baseURL.trim())
    throw new Error('AI_OPENAI_COMPATIBLE_BASE_URL_REQUIRED');
  return createOpenAICompatible({ ...options, name: 'openaiCompatible', baseURL });
};
