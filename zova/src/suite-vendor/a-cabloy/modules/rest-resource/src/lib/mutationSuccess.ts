export interface IMutationSuccessOptions {
  invalidateSelect?: () => Promise<void>;
  invalidateItem?: () => Promise<void>;
  onSuccess?: () => void | Promise<void>;
}

export async function runMutationSuccess(options: IMutationSuccessOptions) {
  await options.invalidateSelect?.();
  await options.invalidateItem?.();
  await options.onSuccess?.();
}
