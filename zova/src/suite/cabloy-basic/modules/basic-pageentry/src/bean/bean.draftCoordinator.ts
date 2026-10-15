import type { BeanRouter, IRouteDiscardEvent } from 'zova-module-a-router';

import { BeanBase } from 'zova';
import { Bean } from 'zova-module-a-bean';

import type { ModelDraft } from '../model/draft.js';
import type { IDraftEditor, IDraftEnvelope, IDraftIdentity } from '../types/draft.js';

interface IDraftSession {
  generation: number;
  barrier: Promise<void>;
  owner?: ModelDraft;
}

@Bean()
export class BeanDraftCoordinator extends BeanBase {
  private _sessions = new Map<string, IDraftSession>();
  private _identityPaths = new Map<string, IDraftIdentity>();
  private _offDiscard?: () => void;
  private _offContext?: () => void;

  protected async __init__() {
    if (!process.env.CLIENT) return;
    this._offContext = this.$modelPersistence.subscribe(() => {
      for (const session of this._sessions.values()) ++session.generation;
      this._sessions.clear();
      this._identityPaths.clear();
    });
    this._offDiscard = this.app.meta.event.on('a-router:routeDiscard', (event, next) => {
      this._discardRoutes(event);
      return next();
    });
  }

  protected __dispose__() {
    this._offDiscard?.();
    this._offContext?.();
  }

  identity(
    router: BeanRouter,
    fullPath: string,
    resource?: string,
    mode?: 'create' | 'edit',
    id?: string | number,
  ): IDraftIdentity | undefined {
    const user = this.$passport.user;
    if (
      !process.env.CLIENT ||
      !this.$passport.isAuthenticated ||
      !user ||
      user.anonymous ||
      user.id == null
    ) {
      return;
    }
    const route = router.resolve(fullPath);
    if (!resource) {
      if (route.name === 'rest-resource:entryCreate') {
        mode = 'create';
      } else if (route.name === 'rest-resource:entry' && route.params.formScene === 'edit') {
        mode = 'edit';
        id = String(route.params.id);
      } else {
        return;
      }
      resource = String(route.params.resource);
    }
    if (!mode) return;
    return {
      context: this.$modelPersistence.capture(),
      resource,
      mode,
      id: mode === 'edit' ? String(id) : undefined,
      path: route.path,
    };
  }

  key(identity: IDraftIdentity) {
    return JSON.stringify([identity.resource, identity.mode, identity.id ?? null, identity.path]);
  }

  private _session(key: string) {
    let session = this._sessions.get(key);
    if (!session) {
      session = { generation: 0, barrier: Promise.resolve() };
      this._sessions.set(key, session);
    }
    return session;
  }

  async open(identity: IDraftIdentity): Promise<IDraftEditor | undefined> {
    if (!this.isCurrent(identity)) return;
    const key = this.key(identity);
    this._identityPaths.set(identity.path, identity);
    const session = this._session(key);
    const generation = session.generation;
    await session.barrier;
    if (generation !== session.generation || !this.isCurrent(identity)) return;
    const owner = await this.app.bean._getBeanSelector('basic-pageentry.model.draft', true, key);
    session.owner = owner;
    await owner.load();
    if (generation !== session.generation || !this.isCurrent(identity)) return;
    return { key, generation, owner, identity };
  }

  current(editor: IDraftEditor) {
    return (
      this._session(editor.key).generation === editor.generation && this.isCurrent(editor.identity)
    );
  }

  async save(editor: IDraftEditor, identity: IDraftIdentity, envelope: IDraftEnvelope) {
    if (editor.key !== this.key(identity) || !this.current(editor) || !this.isCurrent(identity))
      return;
    const session = this._session(editor.key);
    await session.barrier;
    if (!this.current(editor) || !this.isCurrent(identity)) return;
    await editor.owner.save(envelope);
  }

  remove(identity: IDraftIdentity): Promise<void> {
    if (!this.isCurrent(identity)) return Promise.resolve();
    const key = this.key(identity);
    const session = this._session(key);
    ++session.generation;
    const cleanup = session.barrier.then(async () => {
      if (!this.isCurrent(identity)) return;
      const owner =
        session.owner ??
        (await this.app.bean._getBeanSelector('basic-pageentry.model.draft', true, key));
      if (!this.isCurrent(identity)) return;
      session.owner = owner;
      await owner.remove();
    });
    session.barrier = cleanup.catch(() => {});
    return cleanup;
  }

  isCurrent(identity: IDraftIdentity) {
    return (
      this.$passport.isAuthenticated &&
      !this.$passport.user?.anonymous &&
      this.$modelPersistence.current(identity.context)
    );
  }

  private _discardRoutes(event: IRouteDiscardEvent) {
    for (const item of event.items) {
      const path = event.router.resolve(item.fullPath).path;
      const known = this._identityPaths.get(path);
      const identity =
        known && this.isCurrent(known) ? known : this.identity(event.router, item.fullPath);
      if (!identity || !this.isCurrent(identity)) continue;
      event.waitUntil(this.remove(identity));
    }
  }
}
