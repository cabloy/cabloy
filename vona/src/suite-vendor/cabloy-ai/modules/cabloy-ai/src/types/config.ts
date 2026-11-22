import type { generateText, LanguageModel } from 'ai';

export type TypeAiGeneration = Pick<
  Parameters<typeof generateText>[0],
  | 'maxOutputTokens'
  | 'temperature'
  | 'topP'
  | 'topK'
  | 'presencePenalty'
  | 'frequencyPenalty'
  | 'stopSequences'
  | 'seed'
  | 'reasoning'
>;
export interface IAiRequestDefaults {
  maxRetries?: number;
  timeout?: number;
  headers?: Record<string, string>;
}
export type TypeAiProviderOptions = NonNullable<
  Parameters<typeof generateText>[0]['providerOptions']
>;
export interface IAiProviderConnection {
  baseURL?: string;
  apiKey?: string;
  headers?: Record<string, string>;
  fetch?: typeof globalThis.fetch;
  [key: string]: unknown;
}
export interface IAiProviderDefinition {
  factory?: string;
  enabled?: boolean;
  options?: IAiProviderConnection;
}
export interface IAiModelDefinition {
  provider?: string;
  modelId?: string;
  enabled?: boolean;
  generation?: TypeAiGeneration;
  request?: IAiRequestDefaults;
  providerOptions?: TypeAiProviderOptions;
}
export type TypeAiProviderFactory = (options: IAiProviderConnection) => {
  languageModel(modelId: string): LanguageModel;
};
export interface IAiConfig {
  base?: {
    aiProviders?: IAiProviderDefinition;
    aiModels?: IAiModelDefinition;
  };
  providerFactories: Record<string, TypeAiProviderFactory>;
  aiProviders: Record<string, IAiProviderDefinition>;
  aiModels: Record<string, IAiModelDefinition>;
}
