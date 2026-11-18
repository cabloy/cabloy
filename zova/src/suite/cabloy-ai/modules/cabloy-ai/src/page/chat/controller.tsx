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

  protected async __init__() {
    await this.$$modelChat.prepare();
    this.$watch(
      () => [this.$$modelChat.selectedId, this.$passport.user?.id],
      () => {
        this.draft = '';
      },
    );
  }

  async send() {
    const text = this.draft.trim();
    if (!text) return;
    const task = this.$$modelChat.send(text);
    if (!task) return;
    this.draft = '';
    await task;
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
    const busy = model.streaming || model.unsettled || !!conversation?.activeRunId;
    return (
      <ZPage>
        <section class="mx-auto w-full max-w-6xl p-4 md:p-6" data-testid="ai-chat">
          <header class="mb-5">
            <h1 class="text-2xl font-semibold">Private AI chat</h1>
            <p class="mt-1 text-sm text-base-content/70">
              Your saved conversations are private to your account. AI responses may be inaccurate.
            </p>
          </header>
          <div class="grid gap-4 md:grid-cols-[15rem_minmax(0,1fr)]">
            <aside class="rounded-box border border-base-300 bg-base-100 p-3">
              <ZButton
                class="btn btn-outline w-full"
                data-testid="ai-chat-new"
                onPerform={() => model.create()}
              >
                New conversation
              </ZButton>
              <nav aria-label="Conversations" class="mt-3 max-h-96 space-y-2 overflow-y-auto">
                {conversations.data?.map(item => (
                  <ZButton
                    key={item.id}
                    class={[
                      'btn btn-ghost h-auto min-h-10 w-full justify-start text-left',
                      {
                        'btn-active': item.id === model.selectedId,
                      },
                    ]}
                    data-testid="ai-chat-conversation"
                    data-conversation-id={item.id}
                    aria-pressed={item.id === model.selectedId}
                    onPerform={() => model.select(item.id)}
                  >
                    <span class="min-w-0 truncate">{item.title || 'New conversation'}</span>
                  </ZButton>
                ))}
                {conversations.data?.length === 0 && (
                  <p class="p-2 text-sm text-base-content/60">No saved conversations yet.</p>
                )}
              </nav>
            </aside>
            <main class="flex min-w-0 flex-col rounded-box border border-base-300 bg-base-100 p-4">
              <div class="mb-4 flex flex-wrap items-center justify-between gap-2">
                <h2 class="min-w-0 truncate font-semibold">
                  {conversation?.title || 'Start a conversation'}
                </h2>
                {model.selectedId !== undefined && (
                  <ZButton
                    class="btn btn-ghost btn-sm"
                    disabled={model.streaming}
                    onPerform={() => model.refresh()}
                  >
                    Refresh history
                  </ZButton>
                )}
              </div>
              <div
                class="min-h-64 max-h-[55vh] flex-1 space-y-4 overflow-y-auto"
                aria-label="Messages"
                data-testid="ai-chat-messages"
              >
                {history?.data?.messages.map(message => (
                  <article
                    key={message.id}
                    class={['chat', message.role === 'user' ? 'chat-end' : 'chat-start']}
                  >
                    <div class="chat-header text-xs">
                      {message.role === 'user' ? 'You' : 'Assistant'}
                    </div>
                    <div class="chat-bubble max-w-full whitespace-pre-wrap break-words">
                      {message.text}
                    </div>
                  </article>
                ))}
                {model.pendingText && (
                  <article class="chat chat-end">
                    <div class="chat-header text-xs">You · pending confirmation</div>
                    <div class="chat-bubble max-w-full whitespace-pre-wrap break-words">
                      {model.pendingText}
                    </div>
                  </article>
                )}
                {streamingText && (
                  <article class="chat chat-start" data-testid="ai-chat-stream">
                    <div class="chat-header text-xs">Assistant · live response</div>
                    <div class="chat-bubble max-w-full whitespace-pre-wrap break-words">
                      {streamingText}
                    </div>
                  </article>
                )}
                {model.selectedId === undefined && (
                  <p class="text-base-content/60">
                    Create a conversation to send your first message.
                  </p>
                )}
              </div>
              <p
                class="mt-3 min-h-5 text-sm text-base-content/60"
                role="status"
                data-testid="ai-chat-status"
              >
                {model.streaming
                  ? 'Receiving response…'
                  : model.unsettled || conversation?.activeRunId
                    ? 'Waiting for saved request state.'
                    : 'Ready'}
              </p>
              {(model.error || conversations.error || history?.error) && (
                <div role="alert" class="alert alert-warning my-3" data-testid="ai-chat-error">
                  <span>
                    {model.error || 'Conversation history could not be loaded. Please try again.'}
                  </span>
                </div>
              )}
              <label class="mt-3 flex flex-col gap-2">
                <span class="text-sm font-medium">Message</span>
                <textarea
                  class="textarea textarea-bordered min-h-24 w-full resize-y"
                  data-testid="ai-chat-input"
                  placeholder="Type a message"
                  maxlength={32000}
                  disabled={model.selectedId === undefined || busy}
                  v-model={this.draft}
                />
              </label>
              <div class="mt-3 flex flex-wrap justify-end gap-2">
                {model.unsettled && !model.streaming && (
                  <ZButton class="btn btn-outline" onPerform={() => model.retry()}>
                    Retry same request
                  </ZButton>
                )}
                {model.streaming && (
                  <ZButton
                    class="btn btn-outline"
                    data-testid="ai-chat-stop"
                    onPerform={() => model.stop()}
                  >
                    Stop
                  </ZButton>
                )}
                <ZButton
                  class="btn btn-primary"
                  data-testid="ai-chat-send"
                  disabled={model.selectedId === undefined || busy || !this.draft.trim()}
                  onPerform={() => this.send()}
                >
                  Send
                </ZButton>
              </div>
            </main>
          </div>
        </section>
      </ZPage>
    );
  }
}
