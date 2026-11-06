export interface GuardianResult {
  type: 'drained';
  result?: { code: number | null; signal: NodeJS.Signals | null };
  failed: boolean;
}

export interface OwnedProcess {
  wait: () => Promise<GuardianResult>;
  stop: () => Promise<GuardianResult>;
}
