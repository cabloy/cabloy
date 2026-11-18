import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { createAiStreamAdapter } from '../src/lib/aiStreamAdapter.ts';

describe('AI stream request credentials', { concurrency: false }, () => {
  for (const withCredentials of [undefined, false, true]) {
    it(`uses prepared withCredentials=${withCredentials} without losing Bearer authentication`, async t => {
      const command = { conversationId: 1, requestKey: 'request-1', text: 'Hello' };
      const fetch = t.mock.method(globalThis, 'fetch', async (_input, init) => {
        assert.equal(String(_input), 'https://api.example.test/api/cabloy/ai/chat/send');
        assert.equal(init?.credentials, withCredentials ? 'include' : 'same-origin');
        const headers = new Headers(init?.headers);
        assert.equal(headers.get('authorization'), 'Bearer fixture-token');
        assert.equal(headers.get('content-type'), 'application/json');
        assert.deepEqual(JSON.parse(String(init?.body)), command);
        assert.ok(init?.signal);
        const events = [
          { type: 'start', messageId: 'message-1' },
          { type: 'text-start', id: 'text-1' },
          { type: 'text-delta', id: 'text-1', delta: 'Reply' },
          { type: 'text-end', id: 'text-1' },
          { type: 'finish', finishReason: 'stop' },
        ];
        return new Response(
          `${events.map(event => `data: ${JSON.stringify(event)}\n\n`).join('')}data: [DONE]\n\n`,
          {
            headers: { 'content-type': 'text/event-stream', 'x-vercel-ai-ui-message-stream': 'v1' },
          },
        );
      });
      try {
        const adapter = createAiStreamAdapter(async () => ({
          baseURL: 'https://api.example.test/',
          url: '/api/cabloy/ai/chat/send',
          headers: { Authorization: 'Bearer fixture-token' },
          withCredentials,
        }));
        let text = '';
        for await (const message of adapter.send(command, new AbortController().signal)) {
          text = message.parts
            .filter(part => part.type === 'text')
            .map(part => part.text)
            .join('');
        }
        assert.equal(text, 'Reply');
        assert.equal(fetch.mock.callCount(), 1);
      } finally {
        fetch.mock.restore();
      }
    });
  }
});
