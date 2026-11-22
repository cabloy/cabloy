import type { VonaApplication } from 'vona';

import { createAnthropic } from '@ai-sdk/anthropic';
import { createOpenAI } from '@ai-sdk/openai';
import { deepExtend } from 'vona';

import type { IAiConfig } from '../types/config.ts';

import { openaiCompatibleFactory } from '../lib/openaiCompatible.ts';
import { testConfig } from './config.test.ts';

export function config(app: VonaApplication): IAiConfig {
  const { env } = app.meta;
  const defaults: IAiConfig = {
    base: {
      aiProviders: {
        enabled: true,
        options: { headers: { 'accept-encoding': 'identity' } },
      },
      aiModels: {
        enabled: true,
        request: { maxRetries: 0 },
      },
    },
    providerFactories: {
      openai: createOpenAI,
      anthropic: createAnthropic,
      openaiCompatible: openaiCompatibleFactory,
    },
    // Deployment chooses its own model ID and supplies a credential through configuration.
    aiProviders: {
      default: {
        ...(env.AI_PROVIDER_DEFAULT_FACTORY && { factory: env.AI_PROVIDER_DEFAULT_FACTORY }),
        options: {
          ...(env.AI_PROVIDER_DEFAULT_BASEURL && { baseURL: env.AI_PROVIDER_DEFAULT_BASEURL }),
          ...(env.AI_PROVIDER_DEFAULT_APIKEY && { apiKey: env.AI_PROVIDER_DEFAULT_APIKEY }),
        },
      },
    },
    aiModels: {
      default: {
        provider: env.AI_MODEL_DEFAULT_PROVIDER || 'default',
        ...(env.AI_MODEL_DEFAULT_MODELID && { modelId: env.AI_MODEL_DEFAULT_MODELID }),
      },
    },
  };
  return app.meta.isTest ? deepExtend({}, defaults, testConfig()) : defaults;
}
