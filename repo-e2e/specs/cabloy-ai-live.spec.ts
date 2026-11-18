import type { APIRequestContext, Page } from '@playwright/test';

import { randomBytes } from 'node:crypto';

import { expect, test } from '../scripts/managedTest.ts';

const chatPath = '/cabloy/ai/chat';
const api = '/api/cabloy/ai/chat';
const prompt = 'Reply with only OK.';
type Id = string | number;
type Account = { username: string; password: string; headers: Record<string, string> };
type Send = { conversationId: Id; requestKey: string; text: string };
type Run = { id: Id; status: string };
type History = {
  conversation: { id: Id; activeRunId: Id | null };
  messages: Array<{ id: Id; runId: Id; role: string; text: string }>;
};
type Chunk = { type: string; delta?: string; messageMetadata?: Record<string, unknown> };

// Explicit opt-in, exactly one provider send, no Playwright retries or credential artifacts.
test.use({ trace: 'off', video: 'off', screenshot: 'off' });
test.describe.configure({ retries: 0 });

function responseFor(page: Page, path: string) {
  return page.waitForResponse(
    response =>
      response.request().method() === 'POST' &&
      new URL(response.url()).pathname === path &&
      !response.request().headers()['x-vona-openapi-schema'],
  );
}

async function captcha(request: APIRequestContext) {
  const response = await request.post('/api/captcha/create', {
    data: { scene: 'captcha-simple:simple' },
  });
  expect(response.ok()).toBe(true);
  const { id, token } = (await response.json()).data;
  expect(typeof id === 'string' && typeof token === 'string').toBe(true);
  return { id, token };
}

async function register(
  request: APIRequestContext,
  origin: string,
  owned: (account: Account) => void,
) {
  const username = `e2e-fixture-ai-${randomBytes(12).toString('hex')}`;
  const password = 'account-e2e-password';
  const response = await request.post('/api/home/user/passport/register', {
    data: {
      username,
      password,
      passwordConfirm: password,
      email: `${username}@example.test`,
      consumerUrl: `${origin}/home/user/activation`,
      captcha: await captcha(request),
    },
  });
  expect(response.ok()).toBe(true);
  const registered = (await response.json()).data;
  const headers = (token: string) => ({
    Accept: 'application/json',
    Authorization: `Bearer ${token}`,
  });
  const account: Account = { username, password, headers: headers(registered.jwt.accessToken) };
  owned(account);
  expect(
    (
      await request.post('/api/home/user/passportTest/activateCurrent', {
        headers: account.headers,
      })
    ).ok(),
  ).toBe(true);
  const login = await request.post('/api/home/user/passport/login', {
    data: {
      username,
      password,
      captcha: await captcha(request),
    },
  });
  expect(login.ok()).toBe(true);
  const loggedIn = (await login.json()).data;
  expect(String(loggedIn.passport.user.id) === String(registered.passport.user.id)).toBe(true);
  expect(
    loggedIn.passport.roles.some((role: { name: string }) => role.name === 'registeredUser'),
  ).toBe(true);
  account.headers = headers(loggedIn.jwt.accessToken);
  return account;
}

async function post<T>(
  request: APIRequestContext,
  account: Account,
  action: string,
  data: object,
): Promise<T> {
  const response = await request.post(`${api}/${action}`, { headers: account.headers, data });
  expect(response.ok()).toBe(true);
  return (await response.json()).data as T;
}

function streamChunks(body: string): Chunk[] {
  // Check the text-only public protocol, never attach a raw stream/provider response.
  expect(/apiKey|baseURL|providerMetadata|test-model|AI test response:/.test(body)).toBe(false);
  const chunks = body
    .split('\n')
    .filter(line => line.startsWith('data: ') && line !== 'data: [DONE]')
    .map(line => JSON.parse(line.slice(6)) as Chunk);
  for (const chunk of chunks) {
    expect(['start', 'text-start', 'text-delta', 'text-end', 'finish'].includes(chunk.type)).toBe(
      true,
    );
    expect(
      Object.keys(chunk).every(key =>
        ['type', 'id', 'messageId', 'messageMetadata', 'delta', 'finishReason'].includes(key),
      ),
    ).toBe(true);
    if (chunk.messageMetadata) {
      expect(Object.keys(chunk.messageMetadata).sort()).toEqual([
        'conversationId',
        'errorCode',
        'requestKey',
        'runId',
        'status',
      ]);
    }
  }
  return chunks;
}

async function cleanupAccount(request: APIRequestContext, account: Account, send?: Send) {
  const conversations = await post<Array<{ id: Id }>>(request, account, 'list', {});
  for (const conversation of conversations) {
    await expect
      .poll(
        async () => {
          if (send && String(send.conversationId) === String(conversation.id)) {
            await post(request, account, 'status', {
              conversationId: conversation.id,
              requestKey: send.requestKey,
            });
          }
          return (
            await request.post(`${api}/remove`, {
              headers: account.headers,
              data: { conversationId: conversation.id },
            })
          ).status();
        },
        { timeout: 40_000, intervals: [250, 500, 1_000] },
      )
      .toBe(200);
  }
  expect(
    (
      await request.delete('/api/home/user/passportTest/removeCurrentFixture', {
        headers: account.headers,
      })
    ).ok(),
  ).toBe(true);
}

test(
  'AI live: one real provider browser stream persists, reloads with session SSR, and replays without generation',
  { tag: ['@web', '@ssr', '@ai', '@live'] },
  async ({ page, request, baseURL }) => {
    test.skip(process.env.CABLOY_AI_LIVE_VERIFY !== '1', 'Requires explicit live-provider opt-in');
    test.setTimeout(150_000);
    if (
      !process.env.VONA_TEST_RUN_ID ||
      process.env.CABLOY_AI_LIVE_PREPARED !== process.env.VONA_TEST_RUN_ID ||
      !baseURL ||
      test.info().repeatEachIndex !== 0 ||
      test.info().retry !== 0
    ) {
      throw new Error('AI live qualification requires a single root-managed test run');
    }
    let account: Account | undefined;
    let send: Send | undefined;
    let completed = false;
    let browserSends = 0;
    const errors = { page: 0, hydration: 0 };
    page.on('pageerror', () => errors.page++);
    page.on('console', message => {
      if (/hydrat(?:ion|e).*mismatch|mismatch.*hydrat/i.test(message.text())) errors.hydration++;
    });
    page.on('request', outgoing => {
      if (
        outgoing.method() === 'POST' &&
        new URL(outgoing.url()).pathname === `${api}/send` &&
        !outgoing.headers()['x-vona-openapi-schema']
      ) {
        browserSends++;
        send = outgoing.postDataJSON() as Send;
      }
    });
    try {
      account = await register(request, new URL(baseURL).origin, value => (account = value));
      await page.goto(`/login?${new URLSearchParams({ returnTo: chatPath })}`, {
        waitUntil: 'load',
      });
      await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'web');
      await page.getByPlaceholder('Your Username').fill(account.username);
      await page.getByPlaceholder('Your Password').fill(account.password);
      await expect(page.getByPlaceholder('Please input captcha')).not.toHaveValue('');
      const login = responseFor(page, '/api/home/user/passport/login');
      await page.getByRole('button', { name: 'Login', exact: true }).click();
      expect((await login).ok()).toBe(true);
      await expect(page).toHaveURL(chatPath);
      const created = responseFor(page, `${api}/create`);
      await page.getByTestId('ai-chat-new').click();
      const createdResponse = await created;
      expect(createdResponse.ok()).toBe(true);
      const conversation = (await createdResponse.json()).data as { id: Id };
      await expect(page.locator(`[data-conversation-id="${conversation.id}"]`)).toBeVisible();
      await page.getByTestId('ai-chat-input').fill(prompt);
      // Chromium may discard a consumed fetch stream's response body. Observe a clone
      // in-page without buffering/replacing the application's original streaming body.
      await page.evaluate(path => {
        const state = window as typeof window & { aiLiveStream?: Promise<string> };
        const original = window.fetch;
        window.fetch = async (...args: Parameters<typeof fetch>) => {
          const response = await original.apply(window, args);
          const input = args[0];
          const url = input instanceof Request ? input.url : String(input);
          if (new URL(url, location.href).pathname === path) {
            state.aiLiveStream = response
              .clone()
              .text()
              .catch(() => 'stream-read-failed');
            window.fetch = original;
          }
          return response;
        };
      }, `${api}/send`);
      const sent = responseFor(page, `${api}/send`);
      await page.getByTestId('ai-chat-send').click();
      const response = await sent;
      expect(response.status()).toBe(200);
      expect(response.headers()['content-type']).toContain('text/event-stream');
      expect(response.headers()['x-vercel-ai-ui-message-stream']).toBe('v1');
      const stream = await page.evaluate(
        () => (window as typeof window & { aiLiveStream?: Promise<string> }).aiLiveStream,
      );
      expect(typeof stream).toBe('string');
      const chunks = streamChunks(stream!);
      expect(chunks.filter(chunk => chunk.type === 'text-delta').length).toBeGreaterThan(0);
      const assistant = chunks
        .filter(chunk => chunk.type === 'text-delta')
        .map(chunk => chunk.delta ?? '')
        .join('');
      expect(assistant.trim().length > 0).toBe(true);
      expect(send?.text).toBe(prompt);
      expect(String(send?.conversationId)).toBe(String(conversation.id));
      expect(typeof send?.requestKey === 'string' && send.requestKey.length > 0).toBe(true);
      const run = await post<Run>(request, account, 'status', {
        conversationId: conversation.id,
        requestKey: send!.requestKey,
      });
      expect(run.status).toBe('completed');
      const finish = chunks.find(chunk => chunk.type === 'finish');
      expect(finish?.messageMetadata?.status).toBe('completed');
      expect(finish?.messageMetadata?.runId).toBe(String(run.id));
      const history = await post<History>(request, account, 'history', {
        conversationId: conversation.id,
      });
      expect(history.conversation.activeRunId).toBeNull();
      expect(history.messages.map(({ role, text }) => ({ role, text }))).toEqual([
        { role: 'user', text: prompt },
        { role: 'assistant', text: assistant },
      ]);
      expect(history.messages.every(message => String(message.runId) === String(run.id))).toBe(
        true,
      );
      expect(/apiKey|baseURL|providerMetadata/.test(JSON.stringify(history))).toBe(false);
      await expect(page.getByTestId('ai-chat-status')).toHaveText('Ready');
      await expect(page.getByTestId('ai-chat-messages')).toContainText(assistant);
      await expect(page.getByTestId('ai-chat-stream')).toHaveCount(0);
      await expect(page.getByTestId('ai-chat-error')).toHaveCount(0);
      const document = await page.reload({ waitUntil: 'load' });
      expect(document?.ok()).toBe(true);
      expect(document!.headers()['cache-control']).toBe('private, no-store');
      const serverText = await page.evaluate(
        html =>
          new DOMParser()
            .parseFromString(html, 'text/html')
            .querySelector('[data-testid="ai-chat-messages"]')?.textContent,
        await document!.text(),
      );
      expect(serverText).toContain(assistant);
      await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'web');
      await expect(page.getByTestId('ai-chat-messages')).toContainText(assistant);
      expect(
        await post<History>(request, account, 'history', { conversationId: conversation.id }),
      ).toEqual(history);
      const replay = await request.post(`${api}/send`, { headers: account.headers, data: send });
      expect(replay.status()).toBe(200);
      expect(replay.headers()['x-vercel-ai-ui-message-stream']).toBe('v1');
      const replayChunks = streamChunks(await replay.text());
      expect(replayChunks.some(chunk => chunk.type === 'text-delta')).toBe(false);
      expect(replayChunks.find(chunk => chunk.type === 'finish')?.messageMetadata).toEqual(
        finish!.messageMetadata,
      );
      expect(
        await post<History>(request, account, 'history', { conversationId: conversation.id }),
      ).toEqual(history);
      expect(browserSends).toBe(1);
      expect(errors).toEqual({ page: 0, hydration: 0 });
      console.warn(
        JSON.stringify({
          check: 'live-chat-chain',
          browserSends,
          textDeltas: chunks.filter(chunk => chunk.type === 'text-delta').length,
          textCharacters: assistant.length,
          runStatus: run.status,
          savedMessages: history.messages.length,
          privateSsr: true,
          hydrationErrors: errors.hydration,
          pageErrors: errors.page,
          replayTextDeltas: replayChunks.filter(chunk => chunk.type === 'text-delta').length,
        }),
      );
      test.info().annotations.push({
        type: 'live-proof',
        description:
          'one browser send; native SSE text/finish; durable history; private SSR hydration; replay unchanged',
      });
      completed = true;
    } finally {
      let cleanupFailed = false;
      try {
        await page.goto('about:blank');
      } catch {
        cleanupFailed = true;
      }
      try {
        if (account) await cleanupAccount(request, account, send);
      } catch {
        cleanupFailed = true;
      }
      if (cleanupFailed) {
        // Only fail an otherwise successful test; never replace its original failure.
        // eslint-disable-next-line no-unsafe-finally
        if (completed) throw new Error('AI live qualification fixture cleanup failed');
        console.warn('AI live qualification cleanup also failed; original failure preserved');
      }
    }
  },
);
