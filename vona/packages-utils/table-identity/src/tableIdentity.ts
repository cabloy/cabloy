export type TableIdentity = string | number;
export type TableIdentityType = 'number' | 'bigint';

export const TableIdentity = {
  isZero(id: TableIdentity | null | undefined) {
    return id === 0 || id === '0';
  },
  isEmpty(id: TableIdentity | null | undefined) {
    return id === undefined || id === null || id === '';
  },
  isValid(id: TableIdentity | null | undefined) {
    return !this.isZero(id) && !this.isEmpty(id);
  },
  isEqual(id1: TableIdentity | null | undefined, id2: TableIdentity | null | undefined) {
    if (this.isEmpty(id1) && this.isEmpty(id2)) return true;
    return String(id1) === String(id2);
  },
  isNotEqual(id1: TableIdentity | null | undefined, id2: TableIdentity | null | undefined) {
    return !this.isEqual(id1, id2);
  },
};
