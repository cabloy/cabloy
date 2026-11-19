import { nextTick } from 'vue';
import { BeanControllerPageBase, Use } from 'zova';
import { Controller } from 'zova-module-a-bean';

import { ModelChat } from '../../model/chat.ts';

@Controller()
export class ControllerPageChat extends BeanControllerPageBase {
  @Use()
  $$modelChat: ModelChat;

  draft = '';
  protected _sendButton?: HTMLButtonElement;
  protected _messagesElement?: HTMLDivElement;
  protected _messagesContent?: HTMLDivElement;
  protected _messagesObserver?: ResizeObserver;
  protected _messagesMounted = false;
  protected _messagesDisposed = false;
  protected _followMessagesBottom = true;
  protected _programmaticScrollTop?: number;

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
      () => [this.$$modelChat.selectedId, this.$passport.user?.id, this.sys.env.SITE_ID],
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

  protected _handleInputKeydown(event: KeyboardEvent) {
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

  protected async _rename(item: { id: number | string; title: string }) {
    const title = await this.$performCommand('basic-commands:prompt', {
      title: this.scope.locale.RenameConversationTitle(),
      text: this.scope.locale.RenameConversationPrompt(),
      defaultValue: item.title || this.scope.locale.NewConversation(),
    });
    if (typeof title !== 'string' || !title.trim()) return;
    await this.$$modelChat.rename(item.id, title.trim());
  }

  protected async _delete(item: { id: number | string; title: string }) {
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

  protected _observeMessages() {
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

  protected _disconnectMessages() {
    this._messagesObserver?.disconnect();
    this._messagesObserver = undefined;
    this._programmaticScrollTop = undefined;
  }

  protected _handleMessagesScroll() {
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

  protected _scrollMessagesToBottom(element = this._messagesElement) {
    if (!element || !this._followMessagesBottom || this._messagesDisposed || this.ctx.disposed)
      return;
    element.scrollTop = Math.max(0, element.scrollHeight - element.clientHeight);
    this._programmaticScrollTop = element.scrollTop;
  }

  protected _resetMessagesFollow() {
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
}
