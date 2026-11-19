import type { LanguageModelUsage, ModelMessage, UIMessageChunk } from 'ai';
import type { TableIdentity } from 'table-identity';

import {
  APICallError,
  InvalidResponseDataError,
  JSONParseError,
  NoOutputGeneratedError,
  pipeUIMessageStreamToResponse,
  TypeValidationError,
} from 'ai';
import { createHash } from 'node:crypto';
import { BeanBase, runWithZodQueryCoercion } from 'vona';
import { Service } from 'vona-module-a-bean';
import { Core } from 'vona-module-a-core';

import type { DtoChatRun } from '../dto/chatRun.tsx';
import type { DtoChatSend } from '../dto/chatSend.tsx';
import type { DtoChatStatusRequest } from '../dto/chatStatusRequest.tsx';
import type { EntityConversation } from '../entity/conversation.tsx';
import type { EntityRun, TypeChatRunStatus } from '../entity/run.tsx';
import type { AiInvocation } from '../lib/invocation.ts';
import type { IAiLimits } from '../types/aiScene.ts';

import { chatTransactionRetry } from './conversation.ts';

interface IChatIdentity {
  aiScene: string;
  aiProvider: string;
  aiModel: string;
  modelId: string;
}
interface IChatOutcome {
  status: Exclude<TypeChatRunStatus, 'running'>;
  text?: string;
  usage?: LanguageModelUsage;
  errorCode?: string;
}

@Service()
export class ServiceRun extends BeanBase {
  async prepare(
    userId: TableIdentity,
    command: DtoChatSend,
    identity: IChatIdentity,
    limits: IAiLimits,
  ): Promise<{ run: EntityRun; replay: boolean }> {
    return await this.scope.service.conversation.serializeWrite(() =>
      this.prepareTransaction(userId, command, identity, limits),
    );
  }

  @Core.transaction()
  @Core.retryable(chatTransactionRetry)
  private async prepareTransaction(
    userId: TableIdentity,
    command: DtoChatSend,
    identity: IChatIdentity,
    limits: IAiLimits,
  ): Promise<{ run: EntityRun; replay: boolean }> {
    const text = this.validateCommand(command, limits.maxInputCharacters);
    const conversation = await this.scope.service.conversation.lockOwned(
      userId,
      command.ssrSiteId,
      command.conversationId,
    );
    await this.reconcileLocked(userId, conversation);
    const fingerprint = createHash('sha256').update(text).digest('hex');
    const existing = await this.scope.model.run.get(
      { conversationId: conversation.id, userId, requestKey: command.requestKey },
      {
        disableCacheEntity: true,
        disableCacheQuery: true,
      },
    );
    if (existing) {
      if (existing.fingerprint !== fingerprint)
        this.app.throw(409, this.scope.locale.RequestKeyTextConflict());
      return { run: existing as EntityRun, replay: true };
    }
    if (conversation.activeRunId != null)
      this.app.throw(409, this.scope.locale.ConversationHasActiveRun());
    const run = await this.scope.model.run.insert({
      conversationId: conversation.id,
      userId,
      requestKey: command.requestKey,
      fingerprint,
      status: 'running',
      deadlineAt: Date.now() + limits.timeoutMs,
      finishedAt: null,
      errorCode: null,
      ...identity,
    });
    await this.scope.model.message.insert({
      conversationId: conversation.id,
      userId,
      runId: run.id,
      role: 'user',
      text,
    });
    await this.scope.model.conversation.update({ id: conversation.id, activeRunId: run.id });
    this.$logger.debug('ai.chat.run.admitted');
    return { run, replay: false };
  }

  async reconcile(
    userId: TableIdentity,
    ssrSiteId: string,
    conversationId: TableIdentity,
  ): Promise<void> {
    await this.scope.service.conversation.serializeWrite(() =>
      this.reconcileTransaction(userId, ssrSiteId, conversationId),
    );
  }

  @Core.transaction()
  @Core.retryable(chatTransactionRetry)
  private async reconcileTransaction(
    userId: TableIdentity,
    ssrSiteId: string,
    conversationId: TableIdentity,
  ): Promise<void> {
    const conversation = await this.scope.service.conversation.lockOwned(
      userId,
      ssrSiteId,
      conversationId,
    );
    await this.reconcileLocked(userId, conversation);
  }

  async reconcileLocked(userId: TableIdentity, conversation: EntityConversation): Promise<void> {
    if (conversation.activeRunId == null) return;
    const run = await this.scope.model.run.getForUpdate({
      id: conversation.activeRunId,
      conversationId: conversation.id,
      userId,
    });
    if (run?.status === 'running' && Number(run.deadlineAt) > Date.now()) return;
    if (run?.status === 'running') {
      await this.scope.model.run.update({
        id: run.id,
        status: 'interrupted',
        finishedAt: Date.now(),
        errorCode: 'chat_timeout',
      });
      await this.persistUsage(run, undefined);
      this.$logger.debug('ai.chat.run.expired');
    }
    await this.scope.model.conversation.update({ id: conversation.id, activeRunId: null });
    conversation.activeRunId = null;
  }

  async status(userId: TableIdentity, command: DtoChatStatusRequest): Promise<DtoChatRun | null> {
    await this.reconcile(userId, command.ssrSiteId, command.conversationId);
    const run = await this.scope.model.run.get(
      {
        conversationId: command.conversationId,
        userId,
        requestKey: command.requestKey,
      },
      {
        disableCacheEntity: true,
        disableCacheQuery: true,
      },
    );
    return run ? this.toDto(run as EntityRun) : null;
  }

  async finalize(
    userId: TableIdentity,
    ssrSiteId: string,
    runId: TableIdentity,
    conversationId: TableIdentity,
    outcome: IChatOutcome,
  ): Promise<DtoChatRun> {
    return await this.scope.service.conversation.serializeWrite(() =>
      this.finalizeTransaction(userId, ssrSiteId, runId, conversationId, outcome),
    );
  }

  @Core.transaction()
  @Core.retryable(chatTransactionRetry)
  private async finalizeTransaction(
    userId: TableIdentity,
    ssrSiteId: string,
    runId: TableIdentity,
    conversationId: TableIdentity,
    outcome: IChatOutcome,
  ): Promise<DtoChatRun> {
    const conversation = await this.scope.service.conversation.lockOwned(
      userId,
      ssrSiteId,
      conversationId,
    );
    const run = await this.scope.model.run.getForUpdate({
      id: runId,
      conversationId,
      userId,
    });
    if (!run) this.app.throw(404, this.scope.locale.RunNotFound());
    // Both fences are required: an expired owner may finish after another turn was admitted.
    if (run.status !== 'running' || String(conversation.activeRunId) !== String(runId))
      return this.toDto(run);
    if (Number(run.deadlineAt) <= Date.now())
      outcome = { status: 'interrupted', errorCode: 'chat_timeout', usage: outcome.usage };
    if (outcome.status === 'completed') {
      await this.scope.model.message.insert({
        conversationId,
        userId,
        runId,
        role: 'assistant',
        text: outcome.text ?? '',
      });
    }
    const changes = {
      status: outcome.status,
      finishedAt: Date.now(),
      errorCode: outcome.errorCode ?? null,
    };
    await this.scope.model.run.update({ id: runId, ...changes });
    await this.persistUsage(run, outcome.usage);
    await this.scope.model.conversation.update({ id: conversationId, activeRunId: null });
    this.$logger.debug('ai.chat.run.terminal');
    return this.toDto({ ...run, ...changes });
  }

  async send(userId: TableIdentity, command: DtoChatSend): Promise<void> {
    // Authorize before resolving deployment configuration. Browser fields never select a scene/model.
    await this.scope.service.conversation.requireOwned(
      userId,
      command.ssrSiteId,
      command.conversationId,
    );
    const text = this.validateCommand(command, 32000);
    await this.reconcile(userId, command.ssrSiteId, command.conversationId);
    const existing = await this.scope.model.run.get(
      {
        conversationId: command.conversationId,
        userId,
        requestKey: command.requestKey,
      },
      { disableCacheEntity: true, disableCacheQuery: true },
    );
    if (existing) {
      if (existing.fingerprint !== createHash('sha256').update(text).digest('hex'))
        this.app.throw(409, this.scope.locale.RequestKeyTextConflict());
      await this.replay(existing as EntityRun);
      return;
    }
    // Only new admission depends on current deployment availability. Prepare rechecks under lock.
    const bound = await this.bean.ai.create('cabloy-ai:default');
    this.validateCommand(command, bound.limits.maxInputCharacters);
    if (JSON.stringify([{ role: 'user', content: text }]).length > bound.limits.maxInputCharacters)
      this.app.throw(422, this.scope.locale.InvalidChatText());
    const { run, replay } = await this.prepare(userId, command, bound.identity, bound.limits);
    if (replay) {
      await this.replay(run);
      return;
    }
    // Provider wire schemas are strict, not HTTP query-string inputs. Keep the
    // complete lazy stream and finalization lifecycle inside this async boundary.
    await runWithZodQueryCoercion(false, () => this.execute(userId, command, run, bound));
  }

  private async replay(run: EntityRun): Promise<void> {
    const response = this.ctx.res;
    const metadata = this.metadata(this.toDto(run));
    const stream = new ReadableStream<UIMessageChunk>({
      start(controller) {
        controller.enqueue({
          type: 'start',
          messageId: String(run.id),
          messageMetadata: metadata,
        });
        controller.enqueue({ type: 'finish', messageMetadata: metadata });
        controller.close();
      },
    });
    this.ctx.status = 200;
    this.ctx.respond = false;
    await pipeUIMessageStreamToResponse({ response, stream });
  }

  private async execute(
    userId: TableIdentity,
    command: DtoChatSend,
    run: EntityRun,
    bound: AiInvocation,
  ): Promise<void> {
    const response = this.ctx.res;
    const abort = new AbortController();
    let timedOut = false;
    let disconnected = false;
    let terminal: Promise<DtoChatRun> | undefined;
    let failureLogged = false;
    const diagnoseFailure = (phase: 'sdk' | 'pump' | 'start', error: unknown) => {
      if (failureLogged) return;
      failureLogged = true;
      const family = APICallError.isInstance(error)
        ? 'api_call'
        : TypeValidationError.isInstance(error)
          ? 'schema_validation'
          : JSONParseError.isInstance(error)
            ? 'json_parse'
            : InvalidResponseDataError.isInstance(error)
              ? 'invalid_response'
              : NoOutputGeneratedError.isInstance(error)
                ? 'no_output'
                : 'unknown';
      const status = APICallError.isInstance(error) ? error.statusCode : undefined;
      const httpStatus =
        Number.isInteger(status) && status! >= 100 && status! <= 599 ? status : 'unknown';
      // Only fixed classifications and a validated HTTP status cross this boundary.
      this.$logger.debug(
        `ai.chat.run.failure phase=${phase} family=${family} httpStatus=${httpStatus}`,
      );
    };
    const settle = (outcome: IChatOutcome) =>
      (terminal ??= this.finalize(userId, command.ssrSiteId, run.id, run.conversationId, outcome));
    const abortOutcome = (): IChatOutcome =>
      timedOut
        ? { status: 'interrupted', errorCode: 'chat_timeout' }
        : { status: 'aborted', errorCode: 'chat_aborted' };
    const onClose = () => {
      if (response.writableFinished) return;
      disconnected = true;
      abort.abort();
    };
    response.once('close', onClose);
    if (response.destroyed) onClose();
    const timeout = setTimeout(
      () => {
        timedOut = true;
        abort.abort();
      },
      Math.max(1, Number(run.deadlineAt) - Date.now()),
    );
    const startedAt = performance.now();
    let firstTextMs: number | undefined;
    let lastTextMs: number | undefined;
    const textWindows: { ms: number; deltas: number; characters: number }[] = [];
    let execution: Promise<void> | undefined;
    try {
      const history = await this.scope.service.conversation.history(
        userId,
        command.ssrSiteId,
        run.conversationId,
      );
      const messages: ModelMessage[] = [{ role: 'user', content: command.text.trim() }];
      // Match the invocation's serialized-input limit, preserving complete recent turns.
      for (let index = history.messages.length - 2; index >= 0; index -= 2) {
        const user = history.messages[index]!;
        const assistant = history.messages[index + 1]!;
        const pair: ModelMessage[] = [
          { role: 'user', content: user.text },
          { role: 'assistant', content: assistant.text },
        ];
        if (JSON.stringify([...pair, ...messages]).length > bound.limits.maxInputCharacters) break;
        messages.unshift(...pair);
      }
      const result = bound.streamText({
        messages,
        abortSignal: abort.signal,
        maxRetries: 0,
        onError: event => diagnoseFailure('sdk', event.error),
        onAbort: async () => {
          await settle(abortOutcome());
        },
        onEnd: async event => {
          const failed = ['error', 'content-filter', 'tool-calls', 'interrupted'].includes(
            event.finishReason,
          );
          await settle(
            abort.signal.aborted
              ? abortOutcome()
              : failed
                ? { status: 'failed', errorCode: 'chat_failed', usage: event.usage }
                : { status: 'completed', text: event.text, usage: event.usage },
          );
        },
      });
      const stream = new ReadableStream<UIMessageChunk>({
        start: controller => {
          const emit = (chunk: UIMessageChunk) => {
            if (!disconnected) controller.enqueue(chunk);
          };
          execution = (async () => {
            try {
              emit({
                type: 'start',
                messageId: String(run.id),
                messageMetadata: this.metadata(this.toDto(run)),
              });
              for await (const part of result.stream) {
                // Text-only projection: no reasoning, provider metadata, raw errors, files or tool chunks.
                if (part.type === 'text-start') {
                  emit({ type: 'text-start', id: part.id });
                } else if (part.type === 'text-delta') {
                  if (part.text.length) {
                    const ms = Math.round(performance.now() - startedAt);
                    firstTextMs ??= ms;
                    lastTextMs = ms;
                    const windowMs = Math.floor(ms / 250) * 250;
                    let window = textWindows.at(-1);
                    if (window?.ms !== windowMs) {
                      window = { ms: windowMs, deltas: 0, characters: 0 };
                      textWindows.push(window);
                    }
                    window.deltas++;
                    window.characters += part.text.length;
                  }
                  emit({ type: 'text-delta', id: part.id, delta: part.text });
                } else if (part.type === 'text-end') {
                  emit({ type: 'text-end', id: part.id });
                }
              }
              const final = await (terminal ??
                settle(
                  abort.signal.aborted
                    ? abortOutcome()
                    : { status: 'failed', errorCode: 'chat_failed' },
                ));
              // The committed chat outcome is independent of this bounded naming request.
              clearTimeout(timeout);
              if (final.status === 'completed') {
                await this.scope.service.conversation.generateTitle(
                  userId,
                  command.ssrSiteId,
                  run.conversationId,
                  run.id,
                  command.text.trim(),
                  bound,
                  abort.signal,
                );
              } else {
                emit({ type: 'error', errorText: final.errorCode ?? 'chat_failed' });
              }
              emit({
                type: 'finish',
                finishReason: final.status === 'completed' ? 'stop' : 'error',
                messageMetadata: this.metadata(final),
              });
            } catch (error) {
              diagnoseFailure('pump', error);
              try {
                const final = await settle(
                  abort.signal.aborted
                    ? abortOutcome()
                    : { status: 'failed', errorCode: 'chat_failed' },
                );
                emit({ type: 'error', errorText: final.errorCode ?? 'chat_failed' });
                emit({
                  type: 'finish',
                  finishReason: 'error',
                  messageMetadata: this.metadata(final),
                });
              } catch {
                // Do not claim a terminal outcome when its transaction could not commit.
                // A later authoritative read reconciles the bounded running claim.
                this.$logger.debug('ai.chat.run.finalization_failed');
                emit({ type: 'error', errorText: 'chat_persistence_failed' });
              }
            } finally {
              if (!disconnected) controller.close();
            }
          })();
          // Native pump errors are deliberately sanitized, never raw database/provider errors.
          void execution.catch(() => {
            if (!disconnected) controller.error(new Error('chat_stream_failed'));
          });
        },
        cancel: () => {
          disconnected = true;
          abort.abort();
        },
      });
      this.ctx.status = 200;
      this.ctx.respond = false;
      await pipeUIMessageStreamToResponse({ response, stream });
    } catch (error) {
      diagnoseFailure('start', error);
      abort.abort();
      try {
        await settle(
          disconnected ? abortOutcome() : { status: 'failed', errorCode: 'chat_failed' },
        );
      } catch {
        this.$logger.debug('ai.chat.run.finalization_failed');
      }
      if (!this.ctx.respond && !response.destroyed && !response.writableEnded) response.end();
      if (this.ctx.respond) this.app.throw(503, this.scope.locale.ChatCouldNotStart());
    } finally {
      // Join each owner even if another rejected. Never leak persistence/provider diagnostics
      // to the framework error filter after native response ownership has transferred.
      await Promise.allSettled([execution, terminal]);
      clearTimeout(timeout);
      response.off('close', onClose);
      // One content-free summary at the SDK-to-SSE boundary, never per-token logs.
      this.$logger.debug(
        `ai.chat.stream.timing ${JSON.stringify({
          firstTextMs: firstTextMs ?? null,
          lastTextMs: lastTextMs ?? null,
          durationMs: Math.round(performance.now() - startedAt),
          textWindows,
        })}`,
      );
    }
  }

  private validateCommand(command: DtoChatSend, maxInput: number): string {
    if (typeof command.requestKey !== 'string' || !/^[\w-]{1,100}$/.test(command.requestKey))
      this.app.throw(422, this.scope.locale.InvalidRequestKey());
    const text = typeof command.text === 'string' ? command.text.trim() : '';
    if (!text || text.length > Math.min(32000, maxInput))
      this.app.throw(422, this.scope.locale.InvalidChatText());
    return text;
  }

  private async persistUsage(run: EntityRun, usage: LanguageModelUsage | undefined): Promise<void> {
    const tokens = (value: number | undefined) =>
      Number.isSafeInteger(value) && value! >= 0 ? value! : null;
    await this.scope.model.usage.insert({
      conversationId: run.conversationId,
      userId: run.userId,
      runId: run.id,
      inputTokens: tokens(usage?.inputTokens),
      outputTokens: tokens(usage?.outputTokens),
      totalTokens: tokens(usage?.totalTokens),
    });
  }

  private metadata(run: DtoChatRun) {
    return {
      runId: String(run.id),
      conversationId: String(run.conversationId),
      requestKey: run.requestKey,
      status: run.status,
      errorCode: run.errorCode,
    };
  }

  toDto(run: EntityRun): DtoChatRun {
    return {
      id: run.id,
      conversationId: run.conversationId,
      requestKey: run.requestKey,
      status: run.status,
      deadlineAt: Number(run.deadlineAt),
      finishedAt: run.finishedAt == null ? null : Number(run.finishedAt),
      errorCode: run.errorCode ?? null,
    };
  }
}
