import type { APIRequestContext, Page } from '@playwright/test';

import { randomBytes } from 'node:crypto';

import { expect, test } from '../scripts/managedTest.ts';

const chatPath = '/cabloy/ai/chat';
const chatApiPath = '/api/cabloy/ai/chat';
const chatSiteId = 'web';
const responsePrefix = 'AI test response: ';
const streamTimeout = 30_000;

type Identity = string | number;
type Account = {
  id: Identity;
  username: string;
  password: string;
  headers: Record<string, string>;
};
type PassportJwt = {
  passport: { user: { id: Identity }; roles: Array<{ name: string }> };
  jwt: { accessToken: string };
};
type Conversation = { id: Identity; title: string; activeRunId: Identity | null };
type Send = { conversationId: Identity; requestKey: string; text: string };
type Run = {
  id: Identity;
  conversationId: Identity;
  requestKey: string;
  status: 'running' | 'completed' | 'failed' | 'aborted' | 'interrupted';
};
type History = {
  conversation: Conversation;
  messages: Array<{ id: Identity; runId: Identity; role: 'user' | 'assistant'; text: string }>;
};

// Registration/login credentials must never enter retained browser artifacts.
test.use({ trace: 'off', video: 'off', screenshot: 'off' });

test.beforeEach(() => {
  if (!process.env.VONA_TEST_RUN_ID) {
    throw new Error('AI browser tests require the root-managed test:e2e runner');
  }
});

function waitForApiResponse(page: Page, path: string) {
  return page.waitForResponse(response => {
    return (
      response.request().method() === 'POST' &&
      new URL(response.url()).pathname === path &&
      !response.request().headers()['x-vona-openapi-schema']
    );
  });
}

async function createCaptcha(request: APIRequestContext) {
  const response = await request.post('/api/captcha/create', {
    data: { scene: 'captcha-simple:simple' },
  });
  expect(response.ok()).toBe(true);
  const { id, token } = (await response.json()).data;
  expect(typeof id === 'string' && typeof token === 'string').toBe(true);
  return { id, token };
}

async function loginAccount(request: APIRequestContext, account: Account) {
  const response = await request.post('/api/home/user/passport/login', {
    data: {
      username: account.username,
      password: account.password,
      captcha: await createCaptcha(request),
    },
  });
  expect(response.ok()).toBe(true);
  const login = (await response.json()).data as PassportJwt;
  expect(String(login.passport.user.id) === String(account.id)).toBe(true);
  expect(login.passport.roles.map(role => role.name)).toContain('registeredUser');
  account.headers = {
    Accept: 'application/json',
    Authorization: `Bearer ${login.jwt.accessToken}`,
  };
}

async function registerAccount(
  request: APIRequestContext,
  origin: string,
  onRegistered: (account: Account) => void,
) {
  // Reuse the established self-register/activate/login/removeCurrentFixture lifecycle.
  const username = `e2e-fixture-ai-${randomBytes(12).toString('hex')}`;
  const password = 'account-e2e-password';
  const response = await request.post('/api/home/user/passport/register', {
    data: {
      username,
      email: `${username}@example.test`,
      password,
      passwordConfirm: password,
      consumerUrl: `${origin}/home/user/activation`,
      captcha: await createCaptcha(request),
    },
  });
  expect(response.ok()).toBe(true);
  const registered = (await response.json()).data as PassportJwt;
  const account: Account = {
    id: registered.passport.user.id,
    username,
    password,
    headers: { Accept: 'application/json', Authorization: `Bearer ${registered.jwt.accessToken}` },
  };
  onRegistered(account);
  const activated = await request.post('/api/home/user/passportTest/activateCurrent', {
    headers: account.headers,
  });
  expect(activated.ok()).toBe(true);
  await loginAccount(request, account);
  return account;
}

async function loginBrowser(page: Page, account: Account) {
  await page.goto(`/login?${new URLSearchParams({ returnTo: chatPath })}`, {
    waitUntil: 'load',
  });
  await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'web');
  await page.getByPlaceholder('Your Username').fill(account.username);
  await page.getByPlaceholder('Your Password').fill(account.password);
  await expect(page.getByPlaceholder('Please input captcha')).not.toHaveValue('');
  const login = waitForApiResponse(page, '/api/home/user/passport/login');
  await page.getByRole('button', { name: 'Login', exact: true }).click();
  expect((await login).ok()).toBe(true);
  await expect(page).toHaveURL(chatPath);
  await expect(page.getByTestId('ai-chat-input')).toBeVisible();
}

async function postChat<T>(
  request: APIRequestContext,
  account: Account,
  action: string,
  data: Record<string, unknown>,
): Promise<T> {
  const response = await request.post(`${chatApiPath}/${action}`, {
    headers: account.headers,
    data: { ssrSiteId: chatSiteId, ...data },
  });
  expect(response.ok()).toBe(true);
  return (await response.json()).data as T;
}

function observeBrowser(page: Page, sends: Send[]) {
  const errors = { page: 0, hydration: 0 };
  // Retain counts, not arbitrary exception/console text that could contain credentials.
  page.on('pageerror', () => errors.page++);
  page.on('console', message => {
    if (/hydrat(?:ion|e).*mismatch|mismatch.*hydrat/i.test(message.text())) errors.hydration++;
  });
  page.on('request', outgoing => {
    if (
      outgoing.method() === 'POST' &&
      new URL(outgoing.url()).pathname === `${chatApiPath}/send` &&
      !outgoing.headers()['x-vona-openapi-schema']
    ) {
      const body = outgoing.postDataJSON() as Send;
      sends.push({
        conversationId: body.conversationId,
        requestKey: body.requestKey,
        text: body.text,
      });
    }
  });
  return errors;
}

async function newConversation(page: Page): Promise<Conversation> {
  const created = waitForApiResponse(page, `${chatApiPath}/create`);
  await page.getByTestId('ai-chat-new').click();
  const response = await created;
  expect(response.ok()).toBe(true);
  const conversation = (await response.json()).data as Conversation;
  await expect(page.locator(`[data-conversation-id="${conversation.id}"]`)).toBeVisible();
  return conversation;
}

async function sendMessage(page: Page, text: string): Promise<Send> {
  await page.getByTestId('ai-chat-input').fill(text);
  const sent = waitForApiResponse(page, `${chatApiPath}/send`);
  await page.getByTestId('ai-chat-send').click();
  const response = await sent;
  expect(response.status()).toBe(200);
  expect(response.headers()['content-type']).toContain('text/event-stream');
  const body = response.request().postDataJSON() as Send;
  expect(body.text).toBe(text);
  expect(typeof body.requestKey === 'string' && body.requestKey.length > 0).toBe(true);
  return body;
}

async function expectIncrementalText(page: Page, prompt: string, repeatedGrowth = false) {
  // The official test-mode SDK model delays actual HTTP chunks for [slow] prompts.
  // Observe live text, not merely a loading indicator.
  if (repeatedGrowth) {
    const bubble = page.getByTestId('ai-chat-stream').locator('.chat-bubble');
    for (const partial of [
      responsePrefix,
      `${responsePrefix}${prompt.slice(0, Math.ceil(prompt.length / 2))}`,
    ]) {
      await expect(bubble).toHaveText(partial, { timeout: streamTimeout, useInnerText: false });
      await expect(page.getByTestId('ai-chat-status')).toHaveText('Receiving response…');
      await expect(page.getByTestId('ai-chat-stop')).toBeEnabled();
    }
    return;
  }
  await expect
    .poll(
      async () => {
        const stream = page.getByTestId('ai-chat-stream');
        if (!(await stream.count())) return false;
        const text = (await stream.textContent()) ?? '';
        return text.includes(responsePrefix) && !text.includes(`${responsePrefix}${prompt}`);
      },
      { timeout: streamTimeout },
    )
    .toBe(true);
  await expect(page.getByTestId('ai-chat-stop')).toBeEnabled();
}

async function readMessageScroll(page: Page) {
  return await page.getByTestId('ai-chat-messages').evaluate(element => ({
    scrollTop: element.scrollTop,
    scrollHeight: element.scrollHeight,
    clientHeight: element.clientHeight,
    bottomDistance: element.scrollHeight - element.clientHeight - element.scrollTop,
  }));
}

async function waitForTerminal(request: APIRequestContext, account: Account, send: Send) {
  let run: Run | null = null;
  await expect
    .poll(
      async () => {
        run = await postChat<Run | null>(request, account, 'status', {
          conversationId: send.conversationId,
          requestKey: send.requestKey,
        });
        return run?.status ?? 'missing';
      },
      { timeout: streamTimeout },
    )
    .toMatch(/^(completed|failed|aborted|interrupted)$/);
  return run! as Run;
}

async function readHistory(request: APIRequestContext, account: Account, conversationId: Identity) {
  return await postChat<History>(request, account, 'history', { conversationId });
}

function expectCompletedHistory(history: History, prompt: string) {
  expect(history.conversation.activeRunId).toBeNull();
  expect(history.messages.map(({ role, text }) => ({ role, text }))).toEqual([
    { role: 'user', text: prompt },
    { role: 'assistant', text: `${responsePrefix}${prompt}` },
  ]);
  expect(history.messages[0].runId).toBe(history.messages[1].runId);
}

async function cleanupFixtures(request: APIRequestContext, account: Account, sends: Send[]) {
  // Each test has a fresh private account: its owned list is the precise fixture set,
  // including a conversation created just before an assertion/navigation failure.
  const conversations = await postChat<Conversation[]>(request, account, 'list', {});
  const failures: string[] = [];
  for (const conversation of conversations) {
    try {
      await expect
        .poll(
          async () => {
            // Status reconciles an expired claim; transport close normally aborts immediately.
            for (const send of sends.filter(
              send => String(send.conversationId) === String(conversation.id),
            )) {
              await postChat<Run | null>(request, account, 'status', {
                conversationId: conversation.id,
                requestKey: send.requestKey,
              });
            }
            const removed = await request.post(`${chatApiPath}/remove`, {
              headers: account.headers,
              data: { ssrSiteId: chatSiteId, conversationId: conversation.id },
            });
            return removed.status();
          },
          { timeout: 65_000, intervals: [100, 250, 500, 1_000] },
        )
        .toBe(200);
    } catch {
      failures.push('conversation');
    }
  }
  // Do not delete the owner while its persisted dependencies remain.
  if (failures.length) throw new Error('AI conversation fixture cleanup failed');
  const removed = await request.delete('/api/home/user/passportTest/removeCurrentFixture', {
    headers: account.headers,
  });
  expect(removed.ok()).toBe(true);
}

async function finishTest(page: Page, completed: boolean, cleanup: () => Promise<void>) {
  let failed = false;
  try {
    // Abort any live HTTP stream and clear credentials before automatic failure context collection.
    await page.goto('about:blank');
  } catch {
    failed = true;
  }
  try {
    await cleanup();
  } catch {
    failed = true;
  }
  if (!failed) return;
  if (completed) throw new Error('AI browser fixture cleanup failed');
  console.warn('AI browser fixture cleanup also failed; original test failure preserved');
}

test(
  'AI chat: first send creates a conversation, incremental text persists and session SSR reload hydrates saved history',
  { tag: ['@web', '@ssr', '@ai', '@flow'] },
  async ({ page, request, baseURL }) => {
    test.setTimeout(120_000);
    if (!baseURL) throw new Error('Managed E2E origin unavailable');
    let account: Account | undefined;
    let completed = false;
    const sends: Send[] = [];
    const errors = observeBrowser(page, sends);
    const prompt = `[slow] Saved chat ${randomBytes(8).toString('hex')}\n${'Scrollable response line. '.repeat(80).trimEnd()}`;
    try {
      account = await registerAccount(
        request,
        new URL(baseURL).origin,
        registered => (account = registered),
      );
      await loginBrowser(page, account);
      const input = page.getByTestId('ai-chat-input');
      await expect(input).toBeEnabled();
      await expect(page.getByTestId('ai-chat-conversation')).toHaveCount(0);
      await expect(page.getByTestId('ai-chat-send')).toBeDisabled();
      await input.press('Enter');
      await expect(input).toHaveValue('');
      await input.fill('First line');
      await input.press('End');
      await input.press('Shift+Enter');
      await input.press('a');
      await expect(input).toHaveValue('First line\na');
      await input.dispatchEvent('keydown', { key: 'Enter', isComposing: true });
      await input.dispatchEvent('keydown', { key: 'Enter', keyCode: 229 });
      await input.dispatchEvent('keydown', { key: 'Enter', repeat: true });
      expect(await postChat<Conversation[]>(request, account, 'list', {})).toEqual([]);
      expect(sends).toHaveLength(0);
      await input.fill(prompt);

      // A failed creation must leave the draft available for another attempt.
      await page.route(
        `**${chatApiPath}/create`,
        route =>
          route.fulfill({ status: 503, json: { code: 503, message: 'Service unavailable' } }),
        { times: 1 },
      );
      await page.getByTestId('ai-chat-send').click();
      const creationError = page.getByRole('dialog');
      await expect(creationError).toContainText('Service unavailable');
      await creationError.getByRole('button', { name: 'Close', exact: true }).click();
      await expect(creationError).toHaveCount(0);
      await expect(input).toBeEnabled();
      await expect(input).toHaveValue(prompt);
      expect(await postChat<Conversation[]>(request, account, 'list', {})).toEqual([]);
      expect(sends).toHaveLength(0);

      let releaseCreation!: () => void;
      const creationGate = new Promise<void>(resolve => {
        releaseCreation = resolve;
      });
      await page.route(
        `**${chatApiPath}/create`,
        async route => {
          await creationGate;
          await route.continue();
        },
        { times: 1 },
      );
      const created = waitForApiResponse(page, `${chatApiPath}/create`);
      const sent = waitForApiResponse(page, `${chatApiPath}/send`);
      try {
        await input.press('Enter');
        await expect(input).toBeDisabled();
        await expect(page.getByTestId('ai-chat-send')).toBeDisabled();
        await expect(page.getByTestId('ai-chat-new')).toBeDisabled();
      } finally {
        releaseCreation();
      }
      const createdResponse = await created;
      expect(createdResponse.ok()).toBe(true);
      const conversation = (await createdResponse.json()).data as Conversation;
      const sentResponse = await sent;
      expect(sentResponse.status()).toBe(200);
      const send = sentResponse.request().postDataJSON() as Send;
      expect(send.text).toBe(prompt);
      expect(String(send.conversationId)).toBe(String(conversation.id));
      await expect(input).toHaveValue('');
      expect(await postChat<Conversation[]>(request, account, 'list', {})).toHaveLength(1);
      const streamBubble = page.getByTestId('ai-chat-stream').locator('.chat-bubble');
      await expect(streamBubble).toHaveText(responsePrefix, {
        timeout: streamTimeout,
        useInnerText: false,
      });
      await expect
        .poll(async () => (await readMessageScroll(page)).bottomDistance, {
          timeout: streamTimeout,
        })
        .toBeLessThanOrEqual(2);
      const prefixScroll = await readMessageScroll(page);
      expect(prefixScroll.scrollHeight).toBeGreaterThan(prefixScroll.clientHeight);
      expect(prefixScroll.bottomDistance).toBeLessThanOrEqual(2);

      await page.getByTestId('ai-chat-messages').evaluate(element => {
        element.scrollTop = 0;
      });
      await expect
        .poll(async () => (await readMessageScroll(page)).bottomDistance, {
          timeout: streamTimeout,
        })
        .toBeGreaterThan(64);
      const pausedScroll = await readMessageScroll(page);
      await expect(streamBubble).toHaveText(
        `${responsePrefix}${prompt.slice(0, Math.ceil(prompt.length / 2))}`,
        { timeout: streamTimeout, useInnerText: false },
      );
      await expect(page.getByTestId('ai-chat-status')).toHaveText('Receiving response…');
      const pausedGrowth = await readMessageScroll(page);
      expect(pausedGrowth.scrollHeight).toBeGreaterThan(pausedScroll.scrollHeight);
      expect(pausedGrowth.bottomDistance).toBeGreaterThan(64);

      await page.getByTestId('ai-chat-messages').evaluate(element => {
        element.scrollTop = element.scrollHeight;
      });
      await expect
        .poll(async () => (await readMessageScroll(page)).bottomDistance, {
          timeout: streamTimeout,
        })
        .toBeLessThanOrEqual(64);
      await expect(streamBubble).toHaveText(`${responsePrefix}${prompt}`, {
        timeout: streamTimeout,
        useInnerText: false,
      });
      expect((await waitForTerminal(request, account, send)).status).toBe('completed');
      await expect(page.getByTestId('ai-chat-messages')).toContainText(
        `${responsePrefix}${prompt}`,
        {
          timeout: streamTimeout,
        },
      );
      const history = await readHistory(request, account, conversation.id);
      expectCompletedHistory(history, prompt);
      await expect(page.getByTestId('ai-chat-status')).toHaveText('Ready');
      await expect(page.getByTestId('ai-chat-stream')).toHaveCount(0);
      await expect(page.getByTestId('ai-chat-error')).toHaveCount(0);

      const document = await page.reload({ waitUntil: 'load' });
      expect(document?.ok()).toBe(true);
      expect(document!.headers()['cache-control']).toBe('private, no-store');
      const serverMessages = await page.evaluate(
        html => {
          return new DOMParser()
            .parseFromString(html, 'text/html')
            .querySelector('[data-testid="ai-chat-messages"]')?.textContent;
        },
        await document!.text(),
      );
      expect(serverMessages).toContain(`${responsePrefix}${prompt}`);
      await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'web');
      await expect(page.getByTestId('ai-chat-messages')).toContainText(
        `${responsePrefix}${prompt}`,
      );
      const reloaded = await readHistory(request, account, conversation.id);
      expectCompletedHistory(reloaded, prompt);
      expect(reloaded.messages.map(message => message.id)).toEqual(
        history.messages.map(message => message.id),
      );
      expect(sends).toHaveLength(1);
      expect(errors).toEqual({ page: 0, hydration: 0 });
      completed = true;
    } finally {
      await finishTest(page, completed, async () => {
        if (account) await cleanupFixtures(request, account, sends);
      });
    }
  },
);

test(
  'AI chat: Stop reconciles terminal history and permits a subsequent completed turn',
  { tag: ['@web', '@ai', '@flow'] },
  async ({ page, request, baseURL }) => {
    test.setTimeout(120_000);
    if (!baseURL) throw new Error('Managed E2E origin unavailable');
    let account: Account | undefined;
    let completed = false;
    const sends: Send[] = [];
    const errors = observeBrowser(page, sends);
    try {
      account = await registerAccount(
        request,
        new URL(baseURL).origin,
        registered => (account = registered),
      );
      await loginBrowser(page, account);
      const conversation = await newConversation(page);
      const prompt = `[slow] Stop chat ${randomBytes(8).toString('hex')}`;
      const stopped = await sendMessage(page, prompt);
      await expectIncrementalText(page, prompt);
      await page.getByTestId('ai-chat-stop').click();
      expect((await waitForTerminal(request, account, stopped)).status).toBe('aborted');
      const history = await readHistory(request, account, conversation.id);
      expect(history.conversation.activeRunId).toBeNull();
      expect(history.messages).toEqual([]);
      await page.getByRole('button', { name: 'Refresh history', exact: true }).click();
      await expect(page.getByTestId('ai-chat-input')).toBeEnabled();
      await expect(page.getByTestId('ai-chat-status')).toHaveText('Ready');
      await expect(page.getByTestId('ai-chat-stream')).toHaveCount(0);
      await expect(page.getByTestId('ai-chat-messages')).not.toContainText(prompt);

      // A stopped partial response is not model history or a permanently held active claim.
      const recoveredPrompt = `Recovered chat ${randomBytes(8).toString('hex')}`;
      const recovered = await sendMessage(page, recoveredPrompt);
      expect((await waitForTerminal(request, account, recovered)).status).toBe('completed');
      await expect(page.getByTestId('ai-chat-messages')).toContainText(
        `${responsePrefix}${recoveredPrompt}`,
      );
      expectCompletedHistory(await readHistory(request, account, conversation.id), recoveredPrompt);
      expect(errors).toEqual({ page: 0, hydration: 0 });
      completed = true;
    } finally {
      await finishTest(page, completed, async () => {
        if (account) await cleanupFixtures(request, account, sends);
      });
    }
  },
);

test(
  'AI chat: conversation switching and page disposal abort old streams without leaking text',
  { tag: ['@web', '@ai', '@flow'] },
  async ({ page, request, baseURL }) => {
    test.setTimeout(120_000);
    if (!baseURL) throw new Error('Managed E2E origin unavailable');
    let account: Account | undefined;
    let completed = false;
    const sends: Send[] = [];
    const errors = observeBrowser(page, sends);
    try {
      account = await registerAccount(
        request,
        new URL(baseURL).origin,
        registered => (account = registered),
      );
      await loginBrowser(page, account);
      const first = await newConversation(page);
      const second = await newConversation(page);
      await page.locator(`[data-conversation-id="${first.id}"]`).click();
      const switchedPrompt = `[slow] Switched chat ${randomBytes(8).toString('hex')}`;
      const switched = await sendMessage(page, switchedPrompt);
      await expectIncrementalText(page, switchedPrompt);
      await page.locator(`[data-conversation-id="${second.id}"]`).click();
      expect((await waitForTerminal(request, account, switched)).status).toBe('aborted');
      await expect(page.getByTestId('ai-chat-messages')).not.toContainText(switchedPrompt);
      await expect(page.getByTestId('ai-chat-messages')).not.toContainText(responsePrefix);
      expect((await readHistory(request, account, first.id)).messages).toEqual([]);

      const secondPrompt = `Separate chat ${randomBytes(8).toString('hex')}`;
      const secondSend = await sendMessage(page, secondPrompt);
      expect(String(secondSend.conversationId)).toBe(String(second.id));
      expect((await waitForTerminal(request, account, secondSend)).status).toBe('completed');
      expectCompletedHistory(await readHistory(request, account, second.id), secondPrompt);
      await expect(page.getByTestId('ai-chat-messages')).toContainText(
        `${responsePrefix}${secondPrompt}`,
      );
      await expect(page.getByTestId('ai-chat-messages')).not.toContainText(switchedPrompt);

      await page.locator(`[data-conversation-id="${first.id}"]`).click();
      const disposedPrompt = `[slow] Disposed chat ${randomBytes(8).toString('hex')}`;
      const disposed = await sendMessage(page, disposedPrompt);
      await expectIncrementalText(page, disposedPrompt);
      await page.goto('/home/user/account', { waitUntil: 'load' });
      await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'web');
      expect((await waitForTerminal(request, account, disposed)).status).toBe('aborted');
      expect((await readHistory(request, account, first.id)).messages).toEqual([]);
      await page.goto(chatPath, { waitUntil: 'load' });
      await expect(page.locator('html')).toHaveAttribute('data-zova-hydrated', 'web');
      await page.locator(`[data-conversation-id="${second.id}"]`).click();
      await expect(page.getByTestId('ai-chat-messages')).toContainText(
        `${responsePrefix}${secondPrompt}`,
      );
      await expect(page.getByTestId('ai-chat-messages')).not.toContainText(disposedPrompt);
      expectCompletedHistory(await readHistory(request, account, second.id), secondPrompt);
      expect(errors).toEqual({ page: 0, hydration: 0 });
      completed = true;
    } finally {
      await finishTest(page, completed, async () => {
        if (account) await cleanupFixtures(request, account, sends);
      });
    }
  },
);
