import type { LanguageModel, OutputInterface, ToolSet } from 'ai';

import { generateText, streamText } from 'ai';
import { deepExtend, runWithZodQueryCoercion } from 'vona';

import type { IAiLimits } from '../types/aiScene.ts';
import type {
  IAiRequestDefaults,
  TypeAiGeneration,
  TypeAiProviderOptions,
} from '../types/config.ts';

export interface IAiIdentity {
  readonly aiScene: string;
  readonly aiProvider: string;
  readonly aiModel: string;
  readonly modelId: string;
}
type TypeAiDefaults = TypeAiGeneration &
  IAiRequestDefaults & {
    instructions?: string;
    providerOptions?: TypeAiProviderOptions;
  };
export type TypeAiGenerateOptions<
  T extends ToolSet,
  R extends Record<string, unknown>,
  O extends OutputInterface,
> = Omit<Parameters<typeof generateText<T, R, O>>[0], 'model'>;
export type TypeAiStreamOptions<
  T extends ToolSet,
  R extends Record<string, unknown>,
  O extends OutputInterface,
> = Omit<Parameters<typeof streamText<T, R, O>>[0], 'model'>;

/** A request-owned snapshot. No model/client or resolved credential is serialized. */
export class AiInvocation {
  readonly identity: Readonly<IAiIdentity>;
  readonly limits: Readonly<IAiLimits>;
  #model: LanguageModel;
  #defaults: TypeAiDefaults;

  constructor(
    model: LanguageModel,
    identity: IAiIdentity,
    defaults: TypeAiDefaults,
    limits: IAiLimits,
  ) {
    this.#model = model;
    this.#defaults = defaults;
    this.identity = Object.freeze({ ...identity });
    this.limits = Object.freeze({ ...limits });
  }

  generateText<
    T extends ToolSet,
    R extends Record<string, unknown> = Record<string, unknown>,
    O extends OutputInterface = OutputInterface<string, string>,
  >(options: TypeAiGenerateOptions<T, R, O>) {
    return runWithZodQueryCoercion(false, () =>
      generateText<T, R, O>(this.options(options) as Parameters<typeof generateText<T, R, O>>[0]),
    );
  }

  streamText<
    T extends ToolSet,
    R extends Record<string, unknown> = Record<string, unknown>,
    O extends OutputInterface = OutputInterface<string, string, never>,
  >(options: TypeAiStreamOptions<T, R, O>) {
    return runWithZodQueryCoercion(false, () =>
      streamText<T, R, O>(this.options(options) as Parameters<typeof streamText<T, R, O>>[0]),
    );
  }

  private options<T extends object>(options: T) {
    const value = {
      ...this.#defaults,
      ...options,
      model: this.#model,
    } as unknown as Parameters<typeof generateText>[0];
    value.providerOptions = deepExtend({}, this.#defaults.providerOptions, value.providerOptions);
    value.headers = { ...this.#defaults.headers, ...value.headers };
    const maxOutputTokens = value.maxOutputTokens ?? this.limits.maxOutputTokens;
    if (!Number.isInteger(maxOutputTokens) || maxOutputTokens <= 0)
      throw new Error('AI_OUTPUT_LIMIT_INVALID');
    value.maxOutputTokens = Math.min(maxOutputTokens, this.limits.maxOutputTokens);
    if (typeof value.timeout === 'object') {
      value.timeout = {
        ...value.timeout,
        totalMs: Math.min(value.timeout.totalMs ?? this.limits.timeoutMs, this.limits.timeoutMs),
      };
    } else {
      value.timeout = Math.min(value.timeout ?? this.limits.timeoutMs, this.limits.timeoutMs);
    }
    const totalMs = typeof value.timeout === 'number' ? value.timeout : value.timeout.totalMs!;
    if (!Number.isFinite(totalMs) || totalMs <= 0) throw new Error('AI_TIMEOUT_INVALID');
    const input =
      typeof value.prompt === 'string'
        ? value.prompt
        : JSON.stringify(value.messages ?? value.prompt ?? []);
    if (input.length > this.limits.maxInputCharacters) throw new Error('AI_INPUT_LIMIT_EXCEEDED');
    return value;
  }
}
