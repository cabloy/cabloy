import { randomUUID } from 'node:crypto';

import type { GuardianResult, OwnedProcess } from './runIsolatedTest.ts';

import {
  hasTestClaimTransport,
  registerTestClaimWindowsJobVerifier,
  sendTestClaimEvent,
  TEST_CLAIM_WINDOWS_GUARDIAN_ENV,
} from '../vona/packages-vona/vona-core/src/lib/core/testClaim.ts';
import {
  createWindowsNativeJob,
  inspectWindowsProcess,
} from '../vona/packages-vona/vona-core/src/lib/core/testProcessWindowsNative.ts';

/** Windows test containment. The external PS7 helper alone owns the native Job. */
export async function startWindowsOwnedProcess(
  command: string,
  args: string[],
  cwd: string,
  env: NodeJS.ProcessEnv,
  nativeOutput?: Parameters<typeof createWindowsNativeJob>[1],
): Promise<OwnedProcess> {
  if (process.platform !== 'win32')
    throw new Error('Windows owned processes require native Windows and PowerShell 7 (pwsh)');
  const registration = {
    id: randomUUID(),
    role: 'guardian',
    stage: 'pending' as const,
    containment: 'windows-job' as const,
    jobId: randomUUID(),
  };
  // Write-ahead ACK must precede even spawning the native owner. Registration failures
  // deliberately leave pending records; absence of a helper is not drainage evidence.
  await sendTestClaimEvent(env, { type: 'process', process: registration });
  const childEnv = { ...env };
  for (const key of Object.keys(childEnv)) {
    if (key.toUpperCase() === TEST_CLAIM_WINDOWS_GUARDIAN_ENV) delete childEnv[key];
  }
  childEnv[TEST_CLAIM_WINDOWS_GUARDIAN_ENV] = registration.id;
  const native = await createWindowsNativeJob(
    {
      jobId: registration.jobId,
      command,
      args,
      cwd,
      env: childEnv,
    },
    nativeOutput,
  );
  let removeVerifier: (() => void) | undefined;
  let stopping = false;
  const interrupt = () => {
    stopping = true;
    native.stop();
  };
  process.on('SIGINT', interrupt);
  process.on('SIGTERM', interrupt);
  const deadline = setTimeout(interrupt, 30_000);
  try {
    const identity = await native.ready;
    const inspected = await inspectWindowsProcess(identity.pid);
    if (
      !inspected ||
      inspected.startTime !== identity.startTime ||
      inspected.host !== identity.host
    ) {
      throw new Error('Windows native helper identity changed before durable registration');
    }
    const registered = {
      ...registration,
      stage: 'registered' as const,
      pid: identity.pid,
      startTime: identity.startTime,
      host: identity.host,
    };
    await sendTestClaimEvent(env, { type: 'process', process: registered });
    if (hasTestClaimTransport(env)) {
      removeVerifier = await registerTestClaimWindowsJobVerifier(env, registered, async target => {
        if (stopping || target.host !== identity.host) return false;
        return await native.contains(target);
      });
    }
    if (stopping) throw new Error('Windows isolated process startup interrupted');
    // Only a successful durable registered ACK can authorize native CreateProcessW.
    native.authorize();
    await native.started;
    if (stopping) throw new Error('Windows isolated process startup interrupted');
    const completed = native
      .wait()
      .then(async (result): Promise<GuardianResult> => {
        // wait() already verified BOTH native active0/root-exit proof and successful
        // helper process exit. Helper crashes never reach this claim transition.
        await sendTestClaimEvent(env, {
          type: 'process',
          process: {
            ...registration,
            stage: 'drained',
            pid: identity.pid,
            startTime: identity.startTime,
            host: identity.host,
          },
        });
        return { ...result, failed: result.failed || stopping };
      })
      .finally(() => removeVerifier?.());
    void completed.catch(() => {});
    return {
      wait: () => completed,
      stop: async () => {
        stopping = true;
        native.stop();
        const timeout = new Promise<never>((_, reject) => {
          const timer = setTimeout(
            () => reject(new Error('Windows isolated Job did not prove shutdown in time')),
            25_000,
          );
          timer.unref();
          void completed.finally(() => clearTimeout(timer)).catch(() => {});
        });
        const result = await Promise.race([completed, timeout]);
        return { ...result, failed: true };
      },
    };
  } catch (error) {
    removeVerifier?.();
    native.stop();
    try {
      await Promise.race([
        native.wait(),
        new Promise<never>((_, reject) => {
          const timer = setTimeout(
            () => reject(new Error('Windows isolated helper did not finish after startup failure')),
            25_000,
          );
          timer.unref();
          void native
            .wait()
            .finally(() => clearTimeout(timer))
            .catch(() => {});
        }),
      ]);
    } catch (shutdownError) {
      throw new AggregateError(
        [error, shutdownError],
        'Windows isolated process startup failed; claim retained',
      );
    }
    throw error;
  } finally {
    clearTimeout(deadline);
    process.off('SIGINT', interrupt);
    process.off('SIGTERM', interrupt);
  }
}
