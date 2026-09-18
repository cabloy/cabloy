import type { VNodeChild } from 'vue';
import type {
  TypeComponentBoundaryRenderMode,
  TypeComponentBoundaryRetry,
  ZovaContext,
} from 'zova';

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}

export function renderLoading(
  _ctx: ZovaContext,
  renderMode: TypeComponentBoundaryRenderMode,
): VNodeChild {
  if (renderMode === 'inline') {
    return (
      <span
        class="box-border inline-block max-h-full max-w-full overflow-hidden p-1 align-middle"
        role="status"
      >
        <span class="loading loading-spinner text-primary inline-block max-h-full max-w-full align-middle"></span>
      </span>
    );
  }
  return (
    <div class="box-border max-h-full max-w-full overflow-hidden p-2 text-center" role="status">
      <span class="loading loading-spinner text-primary inline-block max-h-full max-w-full align-middle"></span>
    </div>
  );
}

export function renderError(
  ctx: ZovaContext,
  error: unknown,
  renderMode: TypeComponentBoundaryRenderMode,
  retry?: TypeComponentBoundaryRetry,
): VNodeChild {
  const message = getErrorMessage(error);
  const retryLabel = ctx.app.meta.locale.getText(false, 'home-base', undefined, 'Retry');
  const retryButton = retry && (
    <button
      class="btn btn-sm btn-ghost"
      type="button"
      onClick={() => {
        void retry();
      }}
    >
      {retryLabel}
    </button>
  );
  if (renderMode === 'inline') {
    return (
      <span class="box-border inline-block max-h-full max-w-full align-middle">
        <span
          class="bg-error text-error-content inline-block max-h-full max-w-full overflow-auto break-words rounded-field p-2 align-middle"
          role="alert"
        >
          <span>{message}</span>
        </span>
        {retryButton}
      </span>
    );
  }
  return (
    <div class="box-border max-h-full max-w-full overflow-auto p-2 text-center">
      <div
        class="alert alert-error inline-block max-h-full max-w-full overflow-auto break-words text-left align-middle"
        role="alert"
      >
        <span>{message}</span>
      </div>
      {retryButton}
    </div>
  );
}
