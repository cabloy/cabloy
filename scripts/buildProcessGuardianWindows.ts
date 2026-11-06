import { randomUUID } from 'node:crypto';

import type { GuardianResult, OwnedProcess } from './ownedProcess.ts';
import type { WindowsNativeJob } from './testProcessWindowsNative.ts';

import { createWindowsNativeJob } from './testProcessWindowsNative.ts';

/** Build containment owns a native Job, without backend test claims or identity policy. */
export async function startWindowsBuildProcess(
  command: string,
  args: string[],
  cwd: string,
  env: NodeJS.ProcessEnv,
): Promise<OwnedProcess> {
  if (process.platform !== 'win32')
    throw new Error('Windows build processes require native Windows and PowerShell 7 (pwsh)');
  let native: WindowsNativeJob | undefined;
  let stopping = false;
  const interrupt = () => {
    stopping = true;
    native?.stop();
  };
  process.on('SIGINT', interrupt);
  process.on('SIGTERM', interrupt);
  const deadline = setTimeout(interrupt, 30_000);
  try {
    native = await createWindowsNativeJob({ jobId: randomUUID(), command, args, cwd, env });
    if (stopping) throw new Error('Windows build process startup interrupted');
    await native.ready;
    if (stopping) throw new Error('Windows build process startup interrupted');
    native.authorize();
    await native.started;
    if (stopping) throw new Error('Windows build process startup interrupted');
    const owned = native;
    const completed = owned.wait().then((result): GuardianResult => ({
      ...result,
      failed: result.failed || stopping,
    }));
    void completed.catch(() => {});
    return {
      wait: () => completed,
      stop: async () => {
        stopping = true;
        // The native backend bounds stop and requires Job, helper and output drainage.
        owned.stop();
        const result = await completed;
        return { ...result, failed: true };
      },
    };
  } catch (error) {
    if (native) {
      native.stop();
      try {
        await native.wait();
      } catch (shutdownError) {
        throw new AggregateError(
          [error, shutdownError],
          'Windows build process startup failed without proven shutdown',
        );
      }
    }
    throw error;
  } finally {
    clearTimeout(deadline);
    process.off('SIGINT', interrupt);
    process.off('SIGTERM', interrupt);
  }
}
