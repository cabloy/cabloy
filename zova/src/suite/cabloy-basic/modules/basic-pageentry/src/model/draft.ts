import type { IDecoratorModelOptions } from 'zova-module-a-model';

import { BeanModelBase, Model } from 'zova-module-a-model';

import type { IDraftEnvelope } from '../types/draft.ts';

export interface IModelOptionsDraft extends IDecoratorModelOptions {}

@Model<IModelOptionsDraft>({ enableSelector: true })
export class ModelDraft extends BeanModelBase {
  snapshot: IDraftEnvelope | null;
  failed = false;

  protected async __init__(key?: string) {
    await super.__init__(key);
    if (!process.env.CLIENT || !key) return;
    this.snapshot = this.$useStateLocalAsync<IDraftEnvelope | null>({
      queryKey: ['snapshot'],
      meta: { defaultData: null, maxAge: this.scope.config.draft.maxAge },
    });
  }

  async load() {
    try {
      await this.$ensureStateLocalAsync(this.snapshot);
      this.failed = this.$persisterError(['snapshot']);
    } catch {
      this.failed = true;
    }
  }

  async save(envelope: IDraftEnvelope) {
    this.$setQueryData(['snapshot'], envelope, false);
    try {
      await this.$persisterSave(['snapshot']);
      this.failed = false;
    } catch {
      this.failed = true;
    }
  }

  async remove() {
    // Materialize the query without loading a possibly stale persisted snapshot.
    this.$useStateData<IDraftEnvelope | null>({
      queryKey: ['snapshot'],
      enabled: false,
      staleTime: Infinity,
      meta: { persister: { storage: 'db', sync: false }, ssr: { dehydrate: false } },
    });
    this.$setQueryData(['snapshot'], null, false);
    try {
      await this.$persisterRemove(['snapshot']);
      this.failed = false;
    } catch {
      this.failed = true;
      throw new Error('Draft storage removal failed');
    }
  }
}
