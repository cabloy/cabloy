import type { ServiceComposer } from 'zova-module-a-fetch';
import type { IDecoratorModelOptions } from 'zova-module-a-model';

import { markRaw } from 'vue';
import { $QueryEnsureLoaded, BeanModelBase, Model } from 'zova-module-a-model';

import type {
  ApiSchemaCabloyAiDtoChatMessage,
  ApiSchemaCabloyAiDtoChatRun,
} from '../api/openapi/schemas.ts';
import type { ChatSendCommand, ChatStreamMessage } from '../lib/aiStreamAdapter.ts';

import { createAiStreamAdapter } from '../lib/aiStreamAdapter.ts';

export interface IModelOptionsChat extends IDecoratorModelOptions {}

type ConversationId = number | string;

type ChatMessageView = Pick<ApiSchemaCabloyAiDtoChatMessage, 'role' | 'text'> & {
  key: string;
  pending?: boolean;
};

@Model<IModelOptionsChat>()
export class ModelChat extends BeanModelBase {
  selectedId?: ConversationId;
  creating = false;
  streaming = false;
  unsettled = false;
  mutating = false;
  mutationError?: string;
  private _streamMessage?: ChatStreamMessage;
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
      () => [this.$passport.passport?.instanceId, this.$passport.user?.id, this.sys.env.SITE_ID],
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
    const ssrSiteId = this.sys.env.SITE_ID;
    return this.$useStateData({
      queryKey: ['list', ssrSiteId],
      queryFn: ({ signal }) => this.scope.api.cabloyAiChat.list({ ssrSiteId }, { signal }),
      enabled: () => this.$passport.isAuthenticated && !this._disposed,
      retry: false,
      meta: { persister: false },
    });
  }

  history(conversationId = this.selectedId) {
    if (conversationId === undefined) return;
    const ssrSiteId = this.sys.env.SITE_ID;
    return this.$useStateData({
      queryKey: ['history', ssrSiteId, conversationId],
      queryFn: ({ signal }) =>
        this.scope.api.cabloyAiChat.history({ ssrSiteId, conversationId }, { signal }),
      enabled: () => this.$passport.isAuthenticated && !this._disposed,
      retry: false,
      meta: { persister: false },
    });
  }

  messages(saved: ApiSchemaCabloyAiDtoChatMessage[] = []): ChatMessageView[] {
    const messages: ChatMessageView[] = saved.map(({ runId, role, text }) => ({
      key: `${runId}:${role}`,
      role,
      text,
    }));
    const command = this._command;
    if (!command) return messages;
    // Saved history replaces the live turn without moving or remounting its bubbles.
    const runId = this._streamMessage?.metadata?.runId ?? this.status(command)?.data?.id;
    if (runId !== undefined && saved.some(message => String(message.runId) === String(runId))) {
      return messages;
    }
    const turnKey = runId ?? command.requestKey;
    messages.push({ key: `${turnKey}:user`, role: 'user', text: command.text, pending: true });
    const text = this._streamMessage?.parts
      .filter(part => part.type === 'text')
      .map(part => part.text)
      .join('');
    if (text)
      messages.push({ key: `${turnKey}:assistant`, role: 'assistant', text, pending: true });
    return messages;
  }

  status(command = this._command) {
    if (!command) return;
    const { ssrSiteId, conversationId, requestKey } = command;
    return this.$useStateData({
      queryKey: ['status', ssrSiteId, conversationId, requestKey],
      queryFn: ({ signal }) =>
        this.scope.api.cabloyAiChat.status({ ssrSiteId, conversationId, requestKey }, { signal }),
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
    if (this.creating) return;
    this.creating = true;
    const selection = this.select(undefined);
    const revision = this._revision;
    try {
      await selection;
      if (!this._current(revision)) return;
      const conversation = await this.scope.api.cabloyAiChat.create({
        ssrSiteId: this.sys.env.SITE_ID,
      });
      if (!this._current(revision)) return;
      this.selectedId = conversation.id;
      await this.conversations().refetch({ throwOnError: true });
      if (!this._current(revision)) return;
      await $QueryEnsureLoaded(() => this.history());
      if (!this._current(revision)) return;
      this.$logger.debug('ai.chat.conversation created');
      return conversation.id;
    } finally {
      this.creating = false;
    }
  }

  async rename(conversationId: ConversationId, title: string) {
    if (this.mutating) return;
    this.mutating = true;
    this.mutationError = undefined;
    try {
      await this.scope.api.cabloyAiChat.rename({
        ssrSiteId: this.sys.env.SITE_ID,
        conversationId,
        title,
      });
      await this.conversations().refetch({ throwOnError: true });
      if (conversationId === this.selectedId)
        await this.history(conversationId)?.refetch({ throwOnError: true });
      this.$logger.debug('ai.chat.conversation renamed');
    } catch (error) {
      this.mutationError = error instanceof Error ? error.message : String(error);
      throw error;
    } finally {
      this.mutating = false;
    }
  }

  async setPinned(conversationId: ConversationId, pinned: boolean) {
    if (this.mutating) return;
    this.mutating = true;
    this.mutationError = undefined;
    try {
      await this.scope.api.cabloyAiChat.pin({
        ssrSiteId: this.sys.env.SITE_ID,
        conversationId,
        pinned,
      });
      await this.conversations().refetch({ throwOnError: true });
      if (conversationId === this.selectedId)
        await this.history(conversationId)?.refetch({ throwOnError: true });
      this.$logger.debug(`ai.chat.conversation ${pinned ? 'pinned' : 'unpinned'}`);
    } catch (error) {
      this.mutationError = error instanceof Error ? error.message : String(error);
      throw error;
    } finally {
      this.mutating = false;
    }
  }

  async remove(conversationId: ConversationId) {
    if (this.mutating) return;
    this.mutating = true;
    this.mutationError = undefined;
    const wasSelected = conversationId === this.selectedId;
    try {
      await this.scope.api.cabloyAiChat.remove({
        ssrSiteId: this.sys.env.SITE_ID,
        conversationId,
      });
      await this.conversations().refetch({ throwOnError: true });
      if (wasSelected) {
        const nextId = this.conversations().data?.[0]?.id;
        await this.select(nextId);
      }
      this.$logger.debug('ai.chat.conversation removed');
    } catch (error) {
      this.mutationError = error instanceof Error ? error.message : String(error);
      throw error;
    } finally {
      this.mutating = false;
    }
  }

  async select(conversationId: ConversationId | undefined) {
    if (conversationId === this.selectedId) return;
    ++this._revision;
    this._abort?.abort();
    this.streaming = false;
    this.unsettled = false;
    this._command = undefined;
    this._streamMessage = undefined;
    this._error = undefined;
    this.mutationError = undefined;
    this.selectedId = conversationId;
    await $QueryEnsureLoaded(() => this.history());
  }

  send(text: string): Promise<void> | undefined {
    text = text.trim();
    if (!text || this.creating || this.streaming || this.unsettled) return;
    if (this.selectedId === undefined) return this._createAndSend(text);
    const command: ChatSendCommand = {
      ssrSiteId: this.sys.env.SITE_ID,
      conversationId: this.selectedId,
      requestKey: globalThis.crypto.randomUUID(),
      text,
    };
    return this._start(command);
  }

  private async _createAndSend(text: string): Promise<void> {
    const creation = this.create();
    const revision = this._revision;
    const conversationId = await creation;
    if (!this._current(revision) || conversationId === undefined) return;
    await this.send(text);
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
    this._streamMessage = undefined;
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
        this._streamMessage = message;
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
    let terminalStatus: ApiSchemaCabloyAiDtoChatRun['status'] | undefined;
    if (query && command?.conversationId === this.selectedId) {
      // Transport close and durable server finalization may settle a moment apart.
      for (let attempt = 0; attempt < 12; attempt++) {
        const result = await query.refetch({ throwOnError: true });
        if (!this._current(revision)) return;
        if (result.data && result.data.status !== 'running') {
          terminalStatus = result.data.status;
          break;
        }
        if (attempt < 11) await new Promise(resolve => setTimeout(resolve, 150));
      }
    }
    await this.history()?.refetch({ throwOnError: true });
    if (!this._current(revision)) return;
    if (terminalStatus) {
      this.unsettled = false;
      this._command = undefined;
      this._streamMessage = undefined;
      this._error =
        terminalStatus === 'completed'
          ? undefined
          : terminalStatus === 'failed'
            ? 'RequestFailed'
            : terminalStatus === 'aborted'
              ? 'RequestAborted'
              : 'RequestInterrupted';
    } else if (!this.streaming) {
      this._error = 'RequestPending';
    }
    await this.conversations().refetch({ throwOnError: true });
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
    this._streamMessage = undefined;
    this._error = undefined;
    this.mutationError = undefined;
    this._command = undefined;
    // These private queries intentionally have no browser persister. The normal
    // DB-persister identity reset therefore needs its memory-only counterpart.
    void this.$queryClient.resetQueries(this.$normalizeFilters()).catch(() => {});
  }
}
