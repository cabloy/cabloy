import type { ServiceComposer } from 'zova-module-a-fetch';
import type { IDecoratorModelOptions } from 'zova-module-a-model';

import { markRaw } from 'vue';
import { $QueryEnsureLoaded, BeanModelBase, Model } from 'zova-module-a-model';

import type { ChatSendCommand, ChatStreamMessage } from '../lib/aiStreamAdapter.ts';

import { createAiStreamAdapter } from '../lib/aiStreamAdapter.ts';

export interface IModelOptionsChat extends IDecoratorModelOptions {}

type ConversationId = number | string;

@Model<IModelOptionsChat>()
export class ModelChat extends BeanModelBase {
  selectedId?: ConversationId;
  streaming = false;
  unsettled = false;
  streamMessage?: ChatStreamMessage;
  pendingText?: string;
  private _error?:
    | 'ResponseInterrupted'
    | 'SavedStateUnconfirmed'
    | 'RequestFailed'
    | 'RequestAborted'
    | 'RequestInterrupted'
    | 'RequestPending';

  private _command?: ChatSendCommand;
  private _abort?: AbortController;
  private _task?: Promise<void>;
  private _adapter?: ReturnType<typeof createAiStreamAdapter>;
  private _composer?: ServiceComposer;
  private _revision = 0;
  private _disposed = false;

  get error(): string | undefined {
    return this._error ? this.scope.locale[this._error]() : undefined;
  }

  protected async __init__() {
    this.$watch(
      () => [this.$passport.passport?.instanceId, this.$passport.user?.id],
      () => this._changeAccount(),
      { flush: 'sync' },
    );
  }

  protected __dispose__() {
    this._disposed = true;
    ++this._revision;
    this._abort?.abort();
  }

  conversations() {
    return this.$useStateData({
      queryKey: ['list'],
      queryFn: ({ signal }) => this.scope.api.cabloyAiChat.list(undefined, { signal }),
      enabled: () => this.$passport.isAuthenticated && !this._disposed,
      retry: false,
      meta: { persister: false },
    });
  }

  history(conversationId = this.selectedId) {
    if (conversationId === undefined) return;
    return this.$useStateData({
      queryKey: ['history', conversationId],
      queryFn: ({ signal }) => this.scope.api.cabloyAiChat.history({ conversationId }, { signal }),
      enabled: () => this.$passport.isAuthenticated && !this._disposed,
      retry: false,
      meta: { persister: false },
    });
  }

  status(command = this._command) {
    if (!command) return;
    const { conversationId, requestKey } = command;
    return this.$useStateData({
      queryKey: ['status', conversationId, requestKey],
      queryFn: ({ signal }) =>
        this.scope.api.cabloyAiChat.status({ conversationId, requestKey }, { signal }),
      enabled: false,
      retry: false,
      meta: { persister: false, disableSuspenseOnInit: true, ssr: { dehydrate: false } },
    });
  }

  async prepare() {
    const revision = this._revision;
    await $QueryEnsureLoaded(() => this.conversations());
    if (!this._current(revision)) return;
    this.selectedId = this.conversations().data?.[0]?.id;
    await $QueryEnsureLoaded(() => this.history());
  }

  async create() {
    await this.select(undefined);
    const revision = this._revision;
    const conversation = await this.scope.api.cabloyAiChat.create({});
    if (!this._current(revision)) return;
    await this.conversations().refetch({ throwOnError: true });
    if (!this._current(revision)) return;
    this.selectedId = conversation.id;
    await $QueryEnsureLoaded(() => this.history());
    this.$logger.debug('ai.chat.conversation created');
  }

  async select(conversationId: ConversationId | undefined) {
    if (conversationId === this.selectedId) return;
    ++this._revision;
    this._abort?.abort();
    this.streaming = false;
    this.unsettled = false;
    this._command = undefined;
    this.streamMessage = undefined;
    this.pendingText = undefined;
    this._error = undefined;
    this.selectedId = conversationId;
    await $QueryEnsureLoaded(() => this.history());
  }

  send(text: string) {
    text = text.trim();
    if (!text || this.selectedId === undefined || this.streaming || this.unsettled) return;
    const command: ChatSendCommand = {
      conversationId: this.selectedId,
      requestKey: globalThis.crypto.randomUUID(),
      text,
    };
    return this._start(command);
  }

  /** A network-ambiguous attempt keeps the same durable request key on retry. */
  retry() {
    if (!this._command || this.streaming) return;
    return this._start(this._command);
  }

  private _start(command: ChatSendCommand) {
    const revision = ++this._revision;
    this._command = command;
    this._error = undefined;
    this.streamMessage = undefined;
    this.pendingText = command.text;
    this.streaming = true;
    this.unsettled = true;
    this._abort = markRaw(new AbortController());
    this._task = this._send(command, this._abort, revision);
    return this._task;
  }

  private async _send(command: ChatSendCommand, abort: AbortController, revision: number) {
    this.$logger.debug('ai.chat.stream started');
    try {
      this._adapter ??= markRaw(createAiStreamAdapter(() => this._prepareStreamRequest()));
      if (!this._current(revision)) return;
      for await (const message of this._adapter.send(command, abort.signal)) {
        if (!this._current(revision)) return;
        this.streamMessage = message;
      }
    } catch (error) {
      if (this._current(revision) && !abort.signal.aborted) {
        // Never retain SDK/provider messages or response bodies.
        const names = [
          'TypeError',
          'ReferenceError',
          'DataCloneError',
          'AI_TypeValidationError',
          'AI_JSONParseError',
          'AI_UIMessageStreamError',
          'AI_APICallError',
        ];
        const name = error instanceof Error && names.includes(error.name) ? error.name : 'unknown';
        this.$logger.debug(`ai.chat.stream.failed ${name}`);
        this._error = 'ResponseInterrupted';
      }
    } finally {
      if (this._current(revision)) {
        this.streaming = false;
        try {
          await this.refresh(revision);
        } catch {
          if (this._current(revision)) {
            this._error = 'SavedStateUnconfirmed';
          }
        }
        if (this._current(revision)) {
          this._abort = undefined;
          this.$logger.debug('ai.chat.stream reconciled');
        }
      }
    }
  }

  async stop() {
    this._abort?.abort();
    await this._task;
  }

  async refresh(revision = this._revision) {
    if (!this._current(revision)) return;
    const command = this._command;
    const query = this.status(command);
    if (query && command?.conversationId === this.selectedId) {
      // Transport close and durable server finalization may settle a moment apart.
      for (let attempt = 0; attempt < 12; attempt++) {
        const result = await query.refetch({ throwOnError: true });
        if (!this._current(revision)) return;
        if (result.data && result.data.status !== 'running') {
          this.unsettled = false;
          this._error =
            result.data.status === 'completed'
              ? undefined
              : result.data.status === 'failed'
                ? 'RequestFailed'
                : result.data.status === 'aborted'
                  ? 'RequestAborted'
                  : 'RequestInterrupted';
          break;
        }
        if (attempt < 11) await new Promise(resolve => setTimeout(resolve, 150));
      }
    }
    await this.history()?.refetch({ throwOnError: true });
    if (!this._current(revision)) return;
    await this.conversations().refetch({ throwOnError: true });
    if (!this._current(revision)) return;
    if (!this.unsettled) {
      this.streamMessage = undefined;
      this.pendingText = undefined;
    } else if (!this.streaming) {
      this._error = 'RequestPending';
    }
  }

  private async _prepareStreamRequest() {
    // Reuse the framework JWT adapter, refresh/expiry rules, and locale/timezone
    // request onions, without routing a native streaming response through Axios.
    this._composer ??= await this.bean._newBean('a-fetch.service.composer', true, this.$fetch, [
      { name: 'a-interceptor:headers' },
      { name: 'a-interceptor:jwt' },
    ]);
    const baseURL = this.sys.util.getOpenApiBaseURL('OPENAPI_BASE_URL_CABLOY_AI');
    return this._composer.executeRequest({
      ...this.sys.util.apiActionConfigPrepare(baseURL, { authToken: true }, true),
      url: this.sys.util.getApiPath('/cabloy/ai/chat/send'),
      method: 'POST',
      headers: {},
    });
  }

  private _current(revision: number) {
    return !this._disposed && revision === this._revision;
  }

  private _changeAccount() {
    ++this._revision;
    this._abort?.abort();
    this.selectedId = undefined;
    this.streaming = false;
    this.unsettled = false;
    this.streamMessage = undefined;
    this.pendingText = undefined;
    this._error = undefined;
    this._command = undefined;
    // These private queries intentionally have no browser persister. The normal
    // DB-persister identity reset therefore needs its memory-only counterpart.
    void this.$queryClient.resetQueries(this.$normalizeFilters()).catch(() => {});
  }
}
