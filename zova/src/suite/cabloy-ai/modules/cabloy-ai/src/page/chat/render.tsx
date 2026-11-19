import type { ComponentPublicInstance } from 'vue';

import MarkdownRender from 'markstream-vue';
import 'markstream-vue/index.css';
import { BeanRenderBase } from 'zova';
import { Render } from 'zova-module-a-bean';
import { ZButton } from 'zova-module-basic-button';
import { ZRowOperations } from 'zova-module-basic-table';
import { ZPage } from 'zova-module-home-base';

@Render()
export class RenderPageChat extends BeanRenderBase {
  render() {
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
                        <span
                          class="min-w-0 truncate"
                          title={item.title || this.scope.locale.NewConversation()}
                        >
                          {item.pinned && <span aria-hidden="true">📌 </span>}
                          {item.title || this.scope.locale.NewConversation()}
                        </span>
                      </ZButton>
                      <ZRowOperations
                        compact
                        slotDefault={() => (
                          <>
                            <ZButton
                              class="btn btn-ghost btn-sm"
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
                              <span>
                                {item.pinned
                                  ? this.scope.locale.UnpinConversation()
                                  : this.scope.locale.PinConversation()}
                              </span>
                            </ZButton>
                            <ZButton
                              class="btn btn-ghost btn-sm"
                              data-testid="ai-chat-rename"
                              data-conversation-id={item.id}
                              aria-label={this.scope.locale.RenameConversation()}
                              title={this.scope.locale.RenameConversation()}
                              disabled={busy}
                              onPerform={() => this._rename(item)}
                            >
                              ✎<span>{this.scope.locale.RenameConversation()}</span>
                            </ZButton>
                            <ZButton
                              class="btn btn-ghost btn-sm text-error"
                              data-testid="ai-chat-delete"
                              data-conversation-id={item.id}
                              aria-label={this.scope.locale.DeleteConversation()}
                              title={this.scope.locale.DeleteConversation()}
                              disabled={busy}
                              onPerform={() => this._delete(item)}
                            >
                              ×<span>{this.scope.locale.DeleteConversation()}</span>
                            </ZButton>
                          </>
                        )}
                      />
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
                      <div class="chat-bubble max-w-full break-words">
                        {message.role === 'user' ? (
                          <span class="whitespace-pre-wrap">{message.text}</span>
                        ) : (
                          <div class={this.cMarkdown}>
                            <MarkdownRender
                              mode="chat"
                              content={message.text}
                              final
                              htmlPolicy="safe"
                            />
                          </div>
                        )}
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
                      <div class="chat-bubble max-w-full break-words">
                        <div class={this.cMarkdown}>
                          <MarkdownRender
                            mode="chat"
                            content={streamingText}
                            final={!model.streaming}
                            htmlPolicy="safe"
                          />
                        </div>
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
