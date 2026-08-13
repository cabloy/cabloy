export class ProviderOperationFailure extends Error {
  constructor(
    readonly failureCode: string,
    readonly summary: string,
  ) {
    super(summary);
  }
}
