export const errors = {
  ResourceBulkIdsEmpty: {
    code: 1001,
    status: 422,
  },
  ResourceBulkIdsInvalid: {
    code: 1003,
    status: 422,
  },
  ResourceBulkIdsDuplicate: {
    code: 1004,
    status: 422,
  },
  ResourceBulkEntriesMissing: {
    code: 1005,
    status: 404,
  },
} as const;
