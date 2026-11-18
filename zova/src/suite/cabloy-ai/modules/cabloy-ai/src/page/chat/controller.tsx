import type { ComponentPublicInstance } from 'vue';

import { nextTick } from 'vue';
import { BeanControllerPageBase, Use } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { ZButton } from 'zova-module-basic-button';
import { ZPage } from 'zova-module-home-base';

import { ModelChat } from '../../model/chat.ts';

@Controller()
export class ControllerPageChat extends BeanControllerPageBase {
  @Use()
  $$modelChat: ModelChat;

  draft = '';
  private _sendButton?: HTMLButtonElement;
  private _messagesElement?: HTMLDivElement;
  private _messagesContent?: HTMLDivElement;
  private _messagesObserver?: ResizeObserver;
  private _messagesMounted = false;
  private _messagesDisposed = false;
  private _followMessagesBottom = true;
  private _programmaticScrollTop?: number;

  protected async __init__() {
    this.$controllerMounted(() => {
      this.$ssr.handleDirectOrOnHydrated(() => {
        if (this.ctx.disposed || this._messagesDisposed) return;
        this._messagesMounted = true;
        this._observeMessages();
      });
    });
    await this.$$modelChat.prepare();
    this.$watch(
      () => [this.$$modelChat.selectedId, this.$passport.user?.id],
      () => {
        this.draft = '';
        this._resetMessagesFollow();
      },
    );
  }

  async send() {
    const text = this.draft.trim();
    if (!text) return;
    const needsConversation = this.$$modelChat.selectedId === undefined;
    const task = this.$$modelChat.send(text);
    if (!task) return;
    this._resetMessagesFollow();
    if (!needsConversation) this.draft = '';
    await task;
  }

  private _handleInputKeydown(event: KeyboardEvent) {
    if (event.key !== 'Enter' || event.shiftKey || event.isComposing || event.keyCode === 229)
      return;
    event.preventDefault();
    if (event.repeat) return;
    this._sendButton?.click();
  }

  retry() {
    this._resetMessagesFollow();
    return this.$$modelChat.retry();
  }

  private async _rename(item: { id: number | string; title: string }) {
    const title = await this.$performCommand('basic-commands:prompt', {
      title: this.scope.locale.RenameConversationTitle(),
      text: this.scope.locale.RenameConversationPrompt(),
      defaultValue: item.title || this.scope.locale.NewConversation(),
    });
    if (typeof title !== 'string' || !title.trim()) return;
    await this.$$modelChat.rename(item.id, title.trim());
  }

  private async _delete(item: { id: number | string; title: string }) {
    const confirmed = await this.$performCommand('basic-commands:confirm', {
      title: this.scope.locale.DeleteConversation(),
      text: this.scope.locale.DeleteConversationConfirm(),
    });
    if (!confirmed) return;
    await this.$$modelChat.remove(item.id);
  }

  setMessagesElement(element?: HTMLDivElement) {
    if (element === this._messagesElement) return;
    this._disconnectMessages();
    this._messagesElement = element;
    this._observeMessages();
  }

  setMessagesContent(element?: HTMLDivElement) {
    if (element === this._messagesContent) return;
    this._disconnectMessages();
    this._messagesContent = element;
    this._observeMessages();
  }

  private _observeMessages() {
    const element = this._messagesElement;
    const content = this._messagesContent;
    if (!this._messagesMounted || this._messagesDisposed || !element || !content) return;
    this._disconnectMessages();
    const observer = new ResizeObserver(() => {
      if (
        this._messagesDisposed ||
        this.ctx.disposed ||
        element !== this._messagesElement ||
        content !== this._messagesContent
      ) {
        return;
      }
      if (this._followMessagesBottom) this._scrollMessagesToBottom(element);
    });
    observer.observe(element);
    observer.observe(content);
    this._messagesObserver = observer;
    this._scrollMessagesToBottom(element);
  }

  private _disconnectMessages() {
    this._messagesObserver?.disconnect();
    this._messagesObserver = undefined;
    this._programmaticScrollTop = undefined;
  }

  private _handleMessagesScroll() {
    const element = this._messagesElement;
    if (!this._messagesMounted || !element || this._messagesDisposed || this.ctx.disposed) return;
    if (
      this._programmaticScrollTop !== undefined &&
      element.scrollTop === this._programmaticScrollTop
    ) {
      this._programmaticScrollTop = undefined;
      return;
    }
    this._programmaticScrollTop = undefined;
    this._followMessagesBottom =
      element.scrollHeight - element.clientHeight - element.scrollTop <= 64;
  }

  private _scrollMessagesToBottom(element = this._messagesElement) {
    if (!element || !this._followMessagesBottom || this._messagesDisposed || this.ctx.disposed)
      return;
    element.scrollTop = Math.max(0, element.scrollHeight - element.clientHeight);
    this._programmaticScrollTop = element.scrollTop;
  }

  private _resetMessagesFollow() {
    this._followMessagesBottom = true;
    this._programmaticScrollTop = undefined;
    void nextTick(() => {
      if (this._messagesDisposed || this.ctx.disposed) return;
      this._scrollMessagesToBottom();
    });
  }

  protected __dispose__() {
    this._messagesDisposed = true;
    this._sendButton = undefined;
    this._messagesMounted = false;
    this._disconnectMessages();
    this._messagesElement = undefined;
    this._messagesContent = undefined;
  }

  protected render() {
    const model = this.$$modelChat;
    const conversations = model.conversations();
    const history = model.history();
    const conversation = history?.data?.conversation;
    const streamingText = model.streamMessage?.parts
      .filter(part => part.type === 'text')
      .map(part => part.text)
      .join('');
    const busy =
      model.creating || model.streaming || model.unsettled || !!conversation?.activeRunId;
    return (
      <ZPage>
        <section class="mx-auto w-full max-w-6xl p-4 md:p-6" data-testid="ai-chat">
          <header class="mb-5">
            <h1 class="text-2xl font-semibold">{this.scope.locale.PrivateAiChat()}</h1>
            <p class="mt-1 text-sm text-base-content/70">
              {this.scope.locale.PrivateAiChatNotice()}
            </p>
          </header>
          <div class="grid gap-4 md:grid-cols-[15rem_minmax(0,1fr)]">
            <aside class="rounded-box border border-base-300 bg-base-100 p-3">
              <ZButton
                class="btn btn-outline w-full"
                data-testid="ai-chat-new"
                disabled={model.creating}
                onPerform={async () => {
                  await model.create();
                }}
              >
                {this.scope.locale.NewConversation()}
              </ZButton>
              <nav
                aria-label={this.scope.locale.Conversations()}
                class="mt-3 max-h-96 space-y-2 overflow-y-auto"
              >
                {conversations.data?.map(item => {
                  const busy = model.mutating || item.activeRunId !== null;
                  return (
                    <div
                      key={item.id}
                      class="flex items-center gap-1"
                      data-testid="ai-chat-conversation"
                      data-conversation-id={item.id}
                    >
                      <ZButton
                        class={[
                          'btn btn-ghost min-w-0 flex-1 justify-start text-left',
                          {
                            'btn-active': item.id === model.selectedId,
                          },
                        ]}
                        disabled={model.mutating}
                        aria-pressed={item.id === model.selectedId}
                        onPerform={() => model.select(item.id)}
                      >
                        <span class="min-w-0 truncate">
                          {item.pinned && <span aria-hidden="true">📌 </span>}
                          {item.title || this.scope.locale.NewConversation()}
                        </span>
                      </ZButton>
                      <ZButton
                        class="btn btn-ghost btn-square btn-sm"
                        data-testid="ai-chat-pin"
                        data-conversation-id={item.id}
                        aria-label={
                          item.pinned
                            ? this.scope.locale.UnpinConversation()
                            : this.scope.locale.PinConversation()
                        }
                        title={
                          item.pinned
                            ? this.scope.locale.UnpinConversation()
                            : this.scope.locale.PinConversation()
                        }
                        disabled={busy}
                        onPerform={() => model.setPinned(item.id, !item.pinned)}
                      >
                        {item.pinned ? '📌' : '☆'}
                      </ZButton>
                      <ZButton
                        class="btn btn-ghost btn-square btn-sm"
                        data-testid="ai-chat-rename"
                        data-conversation-id={item.id}
                        aria-label={this.scope.locale.RenameConversation()}
                        title={this.scope.locale.RenameConversation()}
                        disabled={busy}
                        onPerform={() => this._rename(item)}
                      >
                        ✎
                      </ZButton>
                      <ZButton
                        class="btn btn-ghost btn-square btn-sm text-error"
                        data-testid="ai-chat-delete"
                        data-conversation-id={item.id}
                        aria-label={this.scope.locale.DeleteConversation()}
                        title={this.scope.locale.DeleteConversation()}
                        disabled={busy}
                        onPerform={() => this._delete(item)}
                      >
                        ×
                      </ZButton>
                    </div>
                  );
                })}
                {conversations.data?.length === 0 && (
                  <p class="p-2 text-sm text-base-content/60">
                    {this.scope.locale.NoSavedConversations()}
                  </p>
                )}
              </nav>
            </aside>
            <main class="flex min-w-0 flex-col rounded-box border border-base-300 bg-base-100 p-4">
              <div class="mb-4 flex flex-wrap items-center justify-between gap-2">
                <h2 class="min-w-0 truncate font-semibold">
                  {conversation
                    ? conversation.title || this.scope.locale.NewConversation()
                    : this.scope.locale.StartConversation()}
                </h2>
                {model.selectedId !== undefined && (
                  <ZButton
                    class="btn btn-ghost btn-sm"
                    disabled={model.streaming}
                    onPerform={() => model.refresh()}
                  >
                    {this.scope.locale.RefreshHistory()}
                  </ZButton>
                )}
              </div>
              <div
                class="min-h-64 max-h-[55vh] flex-1 overflow-y-auto"
                aria-label={this.scope.locale.Messages()}
                data-testid="ai-chat-messages"
                onScroll={() => this._handleMessagesScroll()}
                ref={(element: Element | ComponentPublicInstance | null) => {
                  if (!this.ctx.disposed)
                    this.setMessagesElement?.((element as HTMLDivElement | null) ?? undefined);
                }}
              >
                <div
                  class="space-y-4"
                  ref={(element: Element | ComponentPublicInstance | null) => {
                    if (!this.ctx.disposed)
                      this.setMessagesContent?.((element as HTMLDivElement | null) ?? undefined);
                  }}
                >
                  {history?.data?.messages.map(message => (
                    <article
                      key={message.id}
                      class={['chat', message.role === 'user' ? 'chat-end' : 'chat-start']}
                    >
                      <div class="chat-header text-xs">
                        {message.role === 'user'
                          ? this.scope.locale.ChatYou()
                          : this.scope.locale.ChatAssistant()}
                      </div>
                      <div class="chat-bubble max-w-full whitespace-pre-wrap break-words">
                        {message.text}
                      </div>
                    </article>
                  ))}
                  {model.pendingText && (
                    <article class="chat chat-end">
                      <div class="chat-header text-xs">{this.scope.locale.ChatYouPending()}</div>
                      <div class="chat-bubble max-w-full whitespace-pre-wrap break-words">
                        {model.pendingText}
                      </div>
                    </article>
                  )}
                  {streamingText && (
                    <article class="chat chat-start" data-testid="ai-chat-stream">
                      <div class="chat-header text-xs">{this.scope.locale.ChatAssistantLive()}</div>
                      <div class="chat-bubble max-w-full whitespace-pre-wrap break-words">
                        {streamingText}
                      </div>
                    </article>
                  )}
                  {model.selectedId === undefined && (
                    <p class="text-base-content/60">{this.scope.locale.CreateConversationHint()}</p>
                  )}
                </div>
              </div>
              <p
                class="mt-3 min-h-5 text-sm text-base-content/60"
                role="status"
                data-testid="ai-chat-status"
              >
                {model.streaming
                  ? this.scope.locale.ReceivingResponse()
                  : model.unsettled || conversation?.activeRunId
                    ? this.scope.locale.WaitingForSavedRequestState()
                    : this.scope.locale.ChatReady()}
              </p>
              {(model.error || model.mutationError || conversations.error || history?.error) && (
                <div role="alert" class="alert alert-warning my-3" data-testid="ai-chat-error">
                  <span>
                    {model.error ||
                      model.mutationError ||
                      this.scope.locale.ConversationHistoryLoadFailed()}
                  </span>
                </div>
              )}
              <label class="mt-3 flex flex-col gap-2">
                <span class="text-sm font-medium">{this.scope.locale.ChatMessage()}</span>
                <textarea
                  class="textarea textarea-bordered min-h-24 w-full resize-y"
                  data-testid="ai-chat-input"
                  placeholder={this.scope.locale.TypeMessage()}
                  maxlength={32000}
                  disabled={busy}
                  onKeydown={event => this._handleInputKeydown(event)}
                  v-model={this.draft}
                />
              </label>
              <div class="mt-3 flex flex-wrap justify-end gap-2">
                {model.unsettled && !model.streaming && (
                  <ZButton class="btn btn-outline" onPerform={() => this.retry()}>
                    {this.scope.locale.RetrySameRequest()}
                  </ZButton>
                )}
                {model.streaming && (
                  <ZButton
                    class="btn btn-outline"
                    data-testid="ai-chat-stop"
                    onPerform={() => model.stop()}
                  >
                    {this.scope.locale.ChatStop()}
                  </ZButton>
                )}
                <ZButton
                  class="btn btn-primary"
                  data-testid="ai-chat-send"
                  ref={(element: Element | ComponentPublicInstance | null) => {
                    this._sendButton = (element as HTMLButtonElement | null) ?? undefined;
                  }}
                  disabled={busy || !this.draft.trim()}
                  onPerform={() => this.send()}
                >
                  {this.scope.locale.ChatSend()}
                </ZButton>
              </div>
            </main>
          </div>
        </section>
      </ZPage>
    );
  }
}
