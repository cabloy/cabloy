import { BeanBase, deepExtend } from 'vona';
import { Service } from 'vona-module-a-bean';

import type {
  IAiSceneRecord,
  IDecoratorAiSceneOptions,
  TypeAiSceneOverrides,
} from '../types/aiScene.ts';
import type { IAiModelDefinition, IAiProviderDefinition } from '../types/config.ts';

import {
  aiCallOverridesSchema,
  aiConfigNameSchema,
  aiModelSchema,
  aiProviderSchema,
  aiSceneSchema,
  assertAiDatabaseDocument,
  parseAiConfiguration,
} from '../lib/configuration.ts';
import { AiInvocation } from '../lib/invocation.ts';

@Service()
export class ServiceConfiguration extends BeanBase {
  async create(
    sceneName: keyof IAiSceneRecord,
    overrides?: TypeAiSceneOverrides,
  ): Promise<AiInvocation> {
    const scene = await this.resolveScene(sceneName, overrides);
    const modelName = scene.aiModel!;
    const model = await this.resolveModel(modelName);
    const providerName = model.provider!;
    const provider = await this.resolveProvider(providerName);
    const factory = this.scope.config.providerFactories[provider.factory!];
    const options = deepExtend({}, provider.options);
    // Built-ins never implicitly read deployment environment variables as an SDK fallback.
    if (['openai', 'anthropic'].includes(provider.factory!) && !options.apiKey)
      throw new Error('AI_CREDENTIAL_REQUIRED');
    let languageModel;
    try {
      languageModel = factory(options).languageModel(model.modelId!);
    } catch {
      throw new Error('AI_FACTORY_FAILED');
    }
    if (
      !languageModel ||
      typeof languageModel === 'string' ||
      !['v2', 'v3', 'v4'].includes(languageModel.specificationVersion) ||
      typeof languageModel.doGenerate !== 'function' ||
      typeof languageModel.doStream !== 'function'
    ) {
      throw new Error('AI_FACTORY_INVALID_MODEL');
    }
    return new AiInvocation(
      languageModel,
      {
        aiScene: sceneName,
        aiProvider: providerName,
        aiModel: modelName,
        modelId: model.modelId!,
      },
      {
        ...deepExtend({}, model.generation, scene.generation),
        ...deepExtend({}, model.request, scene.request),
        providerOptions: deepExtend({}, model.providerOptions, scene.providerOptions),
        instructions: scene.instructions,
      },
      deepExtend(
        { maxInputCharacters: 32000, maxOutputTokens: 4096, timeoutMs: 60000 },
        scene.limits,
      ),
    );
  }

  async resolveProvider(name: string): Promise<IAiProviderDefinition> {
    parseAiConfiguration(aiConfigNameSchema, name);
    const row = await this.scope.model.aiProvider.get({ name });
    if (!row && !Object.hasOwn(this.scope.config.aiProviders, name))
      throw new Error('AI_PROVIDER_FACTORY_NOT_REGISTERED');
    if (row) {
      assertAiDatabaseDocument(row.overrides, 'provider');
      parseAiConfiguration(aiProviderSchema, row.overrides);
    }
    const config = parseAiConfiguration(
      aiProviderSchema,
      deepExtend(
        {},
        this.scope.config.base?.aiProviders,
        this.scope.config.aiProviders[name],
        row?.overrides,
      ),
    );
    this.validateProvider(config);
    if (config.enabled === false) throw new Error('AI_PROVIDER_DISABLED');
    return config;
  }

  async resolveModel(name: string): Promise<IAiModelDefinition> {
    parseAiConfiguration(aiConfigNameSchema, name);
    const row = await this.scope.model.aiModel.get({ name });
    if (!row && !Object.hasOwn(this.scope.config.aiModels, name))
      throw new Error('AI_MODEL_INCOMPLETE');
    if (row) assertAiDatabaseDocument(row.overrides);
    const config = parseAiConfiguration(
      aiModelSchema,
      deepExtend(
        {},
        this.scope.config.base?.aiModels,
        this.scope.config.aiModels[name],
        row?.overrides,
      ),
    );
    await this.validateModel(config);
    if (config.enabled === false) throw new Error('AI_MODEL_DISABLED');
    return config;
  }

  async resolveScene(
    name: keyof IAiSceneRecord,
    overrides?: TypeAiSceneOverrides,
  ): Promise<IDecoratorAiSceneOptions> {
    this.assertScene(name);
    const onionOptions = this.bean.onion.aiScene.getOnionOptionsDynamic(name);
    const row = await this.scope.model.aiScene.get({ name });
    if (row) assertAiDatabaseDocument(row.overrides);
    const scene = parseAiConfiguration(aiSceneSchema, deepExtend({}, onionOptions, row?.overrides));
    if (scene.enabled === false) throw new Error('AI_SCENE_DISABLED');
    const resolved = parseAiConfiguration(
      aiSceneSchema,
      deepExtend({}, scene, parseAiConfiguration(aiCallOverridesSchema, overrides ?? {})),
    );
    if (!resolved.aiModel) throw new Error('AI_SCENE_MODEL_REQUIRED');
    return resolved;
  }

  async saveProvider(name: string, overrides: IAiProviderDefinition) {
    parseAiConfiguration(aiConfigNameSchema, name);
    assertAiDatabaseDocument(overrides, 'provider');
    const document = parseAiConfiguration(aiProviderSchema, overrides);
    this.validateProvider(
      parseAiConfiguration(
        aiProviderSchema,
        deepExtend(
          {},
          this.scope.config.base?.aiProviders,
          this.scope.config.aiProviders[name],
          document,
        ),
      ),
    );
    return await this.$scope.redlock.service.redlock.lock(
      `cabloy-ai:provider:${name}`,
      async () => {
        const row = await this.scope.model.aiProvider.get({ name }, { cache: { force: true } });
        return row
          ? await this.scope.model.aiProvider.update({ id: row.id, overrides: document })
          : await this.scope.model.aiProvider.insert({ name, overrides: document });
      },
    );
  }

  async saveModel(name: string, overrides: IAiModelDefinition) {
    parseAiConfiguration(aiConfigNameSchema, name);
    assertAiDatabaseDocument(overrides);
    const document = parseAiConfiguration(aiModelSchema, overrides);
    await this.validateModel(
      parseAiConfiguration(
        aiModelSchema,
        deepExtend(
          {},
          this.scope.config.base?.aiModels,
          this.scope.config.aiModels[name],
          document,
        ),
      ),
    );
    return await this.$scope.redlock.service.redlock.lock(`cabloy-ai:model:${name}`, async () => {
      const row = await this.scope.model.aiModel.get({ name }, { cache: { force: true } });
      return row
        ? await this.scope.model.aiModel.update({ id: row.id, overrides: document })
        : await this.scope.model.aiModel.insert({ name, overrides: document });
    });
  }

  async saveScene(name: keyof IAiSceneRecord, overrides: IDecoratorAiSceneOptions) {
    this.assertScene(name);
    assertAiDatabaseDocument(overrides);
    const document = parseAiConfiguration(aiSceneSchema, overrides);
    const effective = parseAiConfiguration(
      aiSceneSchema,
      deepExtend({}, this.bean.onion.aiScene.getOnionOptionsDynamic(name), document),
    );
    if (!effective.aiModel) throw new Error('AI_SCENE_MODEL_REQUIRED');
    await this.resolveModel(effective.aiModel);
    return await this.$scope.redlock.service.redlock.lock(`cabloy-ai:scene:${name}`, async () => {
      const row = await this.scope.model.aiScene.get({ name }, { cache: { force: true } });
      return row
        ? await this.scope.model.aiScene.update({ id: row.id, overrides: document })
        : await this.scope.model.aiScene.insert({ name, overrides: document });
    });
  }

  private assertScene(name: keyof IAiSceneRecord): void {
    parseAiConfiguration(aiConfigNameSchema, name);
    if (!this.bean.onion.aiScene.getOnionSlice(name)) throw new Error('AI_SCENE_NOT_REGISTERED');
  }

  private validateProvider(config: IAiProviderDefinition): void {
    if (
      !config.factory ||
      !Object.hasOwn(this.scope.config.providerFactories, config.factory) ||
      typeof this.scope.config.providerFactories[config.factory] !== 'function'
    ) {
      throw new Error('AI_PROVIDER_FACTORY_NOT_REGISTERED');
    }
  }

  private async validateModel(config: IAiModelDefinition): Promise<void> {
    if (!config.provider || !config.modelId) throw new Error('AI_MODEL_INCOMPLETE');
    await this.resolveProvider(config.provider);
  }
}
