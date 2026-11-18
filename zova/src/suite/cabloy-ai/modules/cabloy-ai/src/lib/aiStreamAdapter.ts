import type { UIMessage } from 'ai';
import type { AxiosRequestConfig } from 'axios';

import { DefaultChatTransport, readUIMessageStream } from 'ai';

export type ChatStreamMessage = UIMessage<{
  runId: string;
  requestKey: string;
  conversationId: string;
  status: string;
  errorCode?: string | null;
}>;

export interface ChatSendCommand {
  conversationId: number | string;
  requestKey: string;
  text: string;
}

/** Native SDK protocol; the Model supplies the normal authenticated request path. */
export function createAiStreamAdapter(prepareRequest: () => Promise<AxiosRequestConfig>) {
  return {
    async *send(command: ChatSendCommand, signal: AbortSignal) {
      const prepared = await prepareRequest();
      signal.throwIfAborted();
      const headers: Record<string, string> = {};
      for (const [key, value] of Object.entries(prepared.headers ?? {})) {
        if (value !== undefined && value !== null) headers[key] = String(value);
      }
      const transport = new DefaultChatTransport<ChatStreamMessage>({
        api: `${(prepared.baseURL ?? '').replace(/\/$/, '')}${prepared.url}`,
        headers,
        credentials: prepared.withCredentials ? 'include' : 'same-origin',
        // The server alone owns history, scene and model selection.
        prepareSendMessagesRequest: () => ({ body: command }),
      });
      const stream = await transport.sendMessages({
        trigger: 'submit-message',
        chatId: String(command.conversationId),
        messageId: undefined,
        messages: [],
        abortSignal: signal,
      });
      for await (const message of readUIMessageStream<ChatStreamMessage>({
        stream,
        terminateOnError: true,
      })) {
        signal.throwIfAborted();
        yield message;
      }
    },
  };
}
