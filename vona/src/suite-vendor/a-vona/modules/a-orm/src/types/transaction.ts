export const TransactionIsolationLevelsMap = {
  DEFAULT: undefined,
  READ_UNCOMMITTED: 'read uncommitted',
  READ_COMMITTED: 'read committed',
  REPEATABLE_READ: 'repeatable read',
  SERIALIZABLE: 'serializable',
  SNAPSHOT: 'snapshot',
};

export type TypeTransactionIsolationLevels =
  | 'DEFAULT'
  | 'READ_UNCOMMITTED'
  | 'READ_COMMITTED'
  | 'REPEATABLE_READ'
  | 'SERIALIZABLE'
  | 'SNAPSHOT';

export type TypeTransactionPropagation =
  | 'REQUIRED'
  | 'SUPPORTS'
  | 'MANDATORY'
  | 'REQUIRES_NEW'
  | 'NOT_SUPPORTED'
  | 'NEVER';

// export type TransactionPropagation=''
export interface ITransactionOptions {
  isolationLevel?: TypeTransactionIsolationLevels;
  readOnly?: boolean;
  propagation?: TypeTransactionPropagation;
}

export interface ITransactionConsistencyCommitOptions {
  ignoreIfNotInTransaction?: boolean;
}
