# Routed Dialog Guide

A routed dialog hosts ordinary Cabloy pages in an isolated dialog-local router without changing the main browser route or URL.

Use `this.$appModal.routedDialog(...)` when one interaction needs page routing inside a modal: for example, a multi-step picker, a detail-to-detail flow, or a focused page-level form. It is supported by both **Cabloy Basic** and **Cabloy Start**, through their edition-local app modules.

## Choose the right primitive

Use a normal `this.$appModal.dialog(...)` when the caller already owns the content and only needs to render supplied dialog VNodes.

Use `routedDialog(...)` when the content should be an ordinary page route with its existing controller, typed params and query, guards, and page-level navigation.

Use a normal application page route instead when the flow must own a shareable, reloadable, or directly accessible browser URL. A routed dialog deliberately has no browser-address-bar ownership.

A routed dialog is also not a Router Tabs or application-shell replacement. It is an embedded, per-dialog page host that uses a local route stack.

## The mental model

Opening a routed dialog does the following:

```text
caller page
  -> $appModal.routedDialog(...)
  -> one embedded BeanRouter + one memory history per dialog
  -> an ordinary target page hosted by ZRouterViewStack
  -> dialog-local navigation, result, and cleanup
```

Each instance has its own router, memory history, Router Stack scene, and dialog context. It shares the application's registered route records and normal route guards, but it does not share route state with the main router or another routed-dialog instance.

Consequently:

- `push`, `replace`, Back, and `RouterLink` inside the dialog do not change the browser URL;
- opening a second routed dialog does not change the first dialog's route or Back state;
- the target page runs through the normal Zova page route pipeline, including generated `$params` and `$query` schemas;
- the dialog host supplies the modal chrome, so the target page is rendered without the normal generated application layout wrapper.

## Define ordinary target routes

A routed-dialog target is an ordinary module page route. Do not invent a separate dialog-only route format.

For a static target, keep the usual static-route convention: omit `name` unless the route has a documented named-route requirement.

```typescript
import { ZPageCustomerPicker } from './.metadata/page/customerPicker.js';

export const routes: IModuleRoute[] = [
  {
    path: 'customerPicker',
    component: ZPageCustomerPicker,
  },
];
```

For a route with dynamic params, continue to declare `name`. This is required for the generated typed `$params` contract.

```typescript
import { ZPageCustomerDetail } from './.metadata/page/customerDetail.js';

export const routes: IModuleRoute[] = [
  {
    name: 'sales:customerDetail',
    path: 'customer/:id',
    component: ZPageCustomerDetail,
  },
];
```

See [Page Route Guide](/frontend/page-route-guide), [Page Params Guide](/frontend/page-params-guide), and [Page Query Guide](/frontend/page-query-guide) for the general route rules. Hosting a route in a dialog does not relax those rules.

## Open a routed dialog

For a static route, use `$router.getPagePath(...)` to create the initial route. The caller still uses its normal application router to construct the target location; the returned route is then installed in the dialog-local router.

```typescript
public openCustomerPicker() {
  const route = this.$router.getPagePath('/sales/customerPicker', {
    query: {
      source: 'invoice',
    },
  });

  this.$appModal.routedDialog({
    route,
  });
}
```

For a dynamic target, use the named route and params.

```typescript
const handle = this.$appModal.routedDialog({
  route: {
    name: 'sales:customerDetail',
    params: { id: customerId },
    query: { source: 'invoice' },
  },
});
```

The first argument describes the routed workflow:

- `route` is the required initial `RouteLocationRaw`;
- `title` and `icon` control dialog header content;
- `props` supplies workflow configuration;
- `session` supplies dialog-private mutable session state;
- `createPageHostProviders` adapts the generic dialog context to a feature-specific page host;
- `onClose` receives a close notification.

Use locale-generated text for user-visible titles and labels in production code. Do not add a hard-coded display string merely to name a dialog.

## Use the handle

`routedDialog(...)` returns immediately, while the embedded router initializes asynchronously.

```typescript
const handle = this.$appModal.routedDialog<TResult, TProps, TSession>(options, dialogOptions);

await handle.ready;
const result = await handle.result;
```

The handle has these public members:

| Member        | Purpose                                                                                                                                                               |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ready`       | Resolves after the local router has initialized and reached its initial route. Rejects if initialization fails or the dialog closes before it becomes ready.          |
| `result`      | Resolves to `TResult` after the hosted workflow calls `resolve(value)`. Resolves to `undefined` after an ordinary close or cancel. Rejects when initialization fails. |
| `push(to)`    | Pushes a route onto this dialog's local history. It waits for `ready` internally.                                                                                     |
| `replace(to)` | Replaces the current local route. It waits for `ready` internally.                                                                                                    |
| `close()`     | Closes the dialog without a business result.                                                                                                                          |

Use `await handle.ready` when the caller must observe successful initialization before doing other work. Calling and awaiting `handle.push(...)` or `handle.replace(...)` is sufficient when navigation is the only next step, because both methods wait for readiness internally.

Handle navigation remains local:

```typescript
await handle.push({
  name: 'sales:customerDetail',
  params: { id: customerId },
});

await handle.replace({
  name: 'sales:customerDetail',
  params: { id: replacementCustomerId },
});
```

After the dialog closes, `push` and `replace` reject instead of navigating a disposed router.

## Navigate inside hosted pages

A page hosted by a routed dialog continues to use ordinary Zova routing APIs. There is no second dialog-specific navigation API.

```typescript
public openDetail() {
  const route = this.$router.getPagePath('/sales/customer/:id', {
    params: { id: this.customerId },
    query: {
      source: this.$query.source,
    },
  });
  return this.$router.push(route);
}

public replaceDetail(id: number) {
  return this.$router.replace({
    name: 'sales:customerDetail',
    params: { id },
  });
}

public goBack() {
  this.$router.back();
}
```

`RouterLink` follows the same dialog-local router automatically.

```tsx
<RouterLink to={this.entryRoute}>Return to the picker</RouterLink>
```

The initial destination is installed with local `replace(...)`, making it the root of the local history:

- initial open has no Back entry;
- local `push(...)` creates a Back entry;
- local `replace(...)` does not create a Back entry;
- the dialog header shows Back only when `showBackButton` is enabled and the local history can go back;
- header Back and `this.$router.back()` navigate local history only; neither turns into a close action at the local root.

The demo route at `/demo/basic/routedDialog` demonstrates page-local `push`, `replace`, `back`, and `RouterLink`, including typed params and query values.

## Return a typed result

The three type parameters describe a complete dialog workflow:

- `TResult`: the value returned to the caller;
- `TProps`: read-mostly configuration supplied when opening the dialog;
- `TSession`: mutable state shared by pages in this one dialog instance.

A caller can await a typed result and preserve its existing state on any normal close:

```typescript
interface ICustomerSelection {
  id: string;
  title: string;
}

interface ICustomerPickerProps {
  initialCustomerId?: string;
}

interface ICustomerPickerSession {
  selectedCustomerId?: string;
}

private async _consumeCustomerPicker(
  handle: IRoutedDialogHandle<ICustomerSelection>,
) {
  const result = await handle.result;
  if (!result) return;

  this.customerId = result.id;
}

public openCustomerPicker() {
  const handle = this.$appModal.routedDialog<
    ICustomerSelection,
    ICustomerPickerProps,
    ICustomerPickerSession
  >({
    route: this.$router.getPagePath('/sales/customerPicker'),
    props: { initialCustomerId: this.customerId },
    session: { selectedCustomerId: this.customerId },
  });

  void this._consumeCustomerPicker(handle);
}
```

The routed-dialog host injects an `IRoutedDialogContext` under `routedDialogContextKey`. Every Zova Bean exposes the current host context through the optional `$routedDialog` shortcut:

```typescript
public confirm(customer: ICustomerSelection) {
  this.$routedDialog?.resolve(customer);
}

public cancel() {
  this.$routedDialog?.cancel();
}
```

`$routedDialog` performs a live host lookup on every access. It is `undefined` outside a routed-dialog host, and it follows the current host when a Bean is reused across host lifecycles. Do not retain a previously read context as a cross-host or cross-lifecycle snapshot; read `this.$routedDialog` at the point where the operation is needed.

`resolve(value)` settles `handle.result` with `value` and closes the dialog. `cancel()` closes it and leaves `handle.result` as `undefined`.

> [!IMPORTANT]
> `undefined` does not mean only an explicit `cancel()`. Closing with the header button, Escape, an enabled backdrop, or `handle.close()` also resolves an unfinished `result` as `undefined`. If business logic must distinguish outcomes, define that distinction in the workflow result or feature session; `onClose` does not expose a close reason.

`onClose` is useful for cleanup or notification, but it is not a substitute for the typed `result` channel. For a reusable business page, prefer the feature-specific host adapter described in the next section rather than coupling the page directly to `IRoutedDialogContext`.

## Pass props, session, and a page host

`props` and `session` are not URL state:

- use route params and query for route-addressable state;
- use `props` for input configuration of one dialog workflow;
- use `session` for mutable state shared across pages and rerenders in that dialog;
- use `result` for the final value returned to the caller.

When a routed page needs feature-specific dialog behavior, create a feature-specific page-host adapter. The current resource picker uses this pattern: `basic-resource` opens the dialog and creates the host, while the `rest-resource` picker page consumes the host contract.

```typescript
const handle = this.$appModal.routedDialog<
  IResourceTableSelectionPayload,
  IResourcePickerPageOptions,
  IResourcePickerPageSession
>({
  route: {
    name: 'rest-resource:resourcePicker',
    params: { resource: this.resource },
  },
  props: options,
  session,
  createPageHostProviders: dialog => ({
    [resourcePickerPageHostKey]: createResourcePickerPageHost(dialog),
  }),
});

const result = await handle.result;
```

The adapter converts the generic dialog contract into the feature contract:

```typescript
export function createResourcePickerPageHost(
  dialog: IRoutedDialogContext<
    IResourceTableSelectionPayload,
    IResourcePickerPageOptions,
    IResourcePickerPageSession
  >,
): IResourcePickerPageHost {
  if (!dialog.props || !dialog.session) {
    throw new Error('resource picker requires dialog options and session');
  }

  return {
    options: dialog.props,
    session: dialog.session,
    resolve: selection => dialog.resolve(selection),
    cancel: () => dialog.cancel(),
  };
}
```

The hosted page consumes the explicit host-scoped contract:

```typescript
@Use({ name: resourcePickerPageHostKey, injectionScope: 'host' })
$$pickerHost: IResourcePickerPageHost | undefined;
```

This keeps a reusable target page coupled to its own feature contract instead of to a generic modal implementation. A page that requires such a host is an internal workflow page: a route record alone does not make it a suitable direct browser entry.

> [!TIP]
> If a workflow declares `TSession`, always provide an initial `session` object. The current input type makes `session` optional, while page-host code that needs it must validate it at runtime.

## Configure presentation

Pass all presentation and close settings in the **second** argument.

```typescript
const handle = this.$appModal.routedDialog(
  {
    route,
    // Use the generated locale key for the actual workflow title.
    title: this.scope.locale.SelectCustomer(),
  },
  {
    maxWidth: { default: 640, md: 768, lg: 960 },
    maxHeight: 'calc(100vh - 3rem)',
    topGutter: { default: 16, md: 32 },
    closeOnBackdrop: false,
    closeOnEscape: true,
    showCloseButton: true,
    showBackButton: true,
  },
);
```

The presentation options are:

| Option            | Meaning                                                                       |
| ----------------- | ----------------------------------------------------------------------------- |
| `maxWidth`        | A number, a CSS size string, or responsive `{ default, md, lg }` widths.      |
| `maxHeight`       | A number or CSS size string.                                                  |
| `topGutter`       | A number, a CSS size string, or responsive `{ default, md, lg }` top gutters. |
| `closeOnBackdrop` | Whether a backdrop click closes the dialog.                                   |
| `closeOnEscape`   | Whether Escape closes the topmost dialog.                                     |
| `showCloseButton` | Whether to display the header close button.                                   |
| `showBackButton`  | Whether to allow the header Back button when local history can go back.       |

Numbers become pixel values. In the current Cabloy Basic implementation, the responsive keys use Tailwind breakpoints: `md` is `48rem` and `lg` is `64rem`.

The current Cabloy Basic defaults are:

| Option            | Default                               |
| ----------------- | ------------------------------------- |
| `maxWidth`        | `{ default: 640, md: 768, lg: 1024 }` |
| `topGutter`       | `{ default: 16, md: 32, lg: 48 }`     |
| `maxHeight`       | `'calc(100vh - 2rem)'`                |
| `closeOnBackdrop` | `false`                               |
| `closeOnEscape`   | `true`                                |
| `showCloseButton` | `true`                                |
| `showBackButton`  | `true`                                |

> [!WARNING]
> `IModalRoutedDialogOptions` currently structurally includes presentation fields in its first argument, but current option resolution is not uniform there. Use the first argument only for route/workflow data and put **all** presentation settings in the second argument. This is the safe public convention for the current implementation.

These defaults and breakpoint details are Cabloy Basic presentation behavior. Do not treat them as edition-neutral Zova guarantees.

## Client-only and SSR boundary

`routedDialog` is explicitly client-only. Its embedded router initialization rejects outside `process.env.CLIENT`.

Therefore:

- open it from a user interaction in the browser in the normal case;
- do not open it in a server-rendered page's server execution path or SSR initialization branch;
- when lifecycle-driven opening is genuinely needed, defer it to an explicit post-hydration client boundary such as `this.$ssr.handleDirectOrOnHydrated(...)`;
- do not infer that an already-open routed dialog can be server-rendered merely because its host page supports SSR.

A Vona integrated SSR page or a Zova standalone SSR page can hydrate successfully and subsequently open a routed dialog on the client. That verifies the host-page hydration boundary; it does not make the dialog router server-renderable.

`ClientOnly` is a render boundary for browser-only UI. It does not make a server-side call to `this.$appModal.routedDialog(...)` valid. See [SSR ClientOnly](/frontend/ssr-client-only) and [SSR Architecture Overview](/frontend/ssr-architecture-overview).

## Lifecycle and cleanup

The observable lifecycle is:

```text
loading -> ready -> closed
loading -> error -> closed
```

While loading, the modal renders a loading state. On initialization failure, `ready` and `result` reject and the dialog renders an error state until it is closed.

A normal close is idempotent and disposes the embedded router and memory history. It also removes the dialog from the modal stack, so Escape always applies only to the most recently opened eligible modal.

When several dialogs are open, each has independent route visits, Back state, page instances, and cleanup. The only shared surface is the application route table and application-level services.

## Common mistakes

### Treating it as a URL navigation feature

A routed dialog uses memory history. Its local route is not the browser route, so do not use it for a flow that must survive reloads, be bookmarked, or be sent to someone as a URL.

### Adding a special page-navigation API

Do not create one. Hosted pages use the normal `$router`, `RouterLink`, `$params`, and `$query` APIs; the host scope supplies the local router automatically.

### Expecting Back to close the root page

Back is navigation, not close. At the local root it is hidden. Offer an explicit workflow cancellation or close action when the user needs to leave the dialog.

### Storing non-URL workflow state in query

Use `props` and `session` for private workflow configuration/state, and use `result` for completion. Keep params and query for route-addressable state.

### Calling it during SSR

Do not call it from server execution. Defer opening to a client interaction or an explicit post-hydration boundary.

## Verification

After changing a routed-dialog workflow, verify the smallest relevant surface first:

1. Open the existing `/demo/basic/routedDialog` demo after hydration.
2. Confirm that opening, local `push`, local `replace`, local Back, and `RouterLink` do not change the main browser URL.
3. Confirm that `push` enables Back but `replace` from the local root does not.
4. Open two dialogs and confirm that navigation in one does not alter the other.
5. Confirm that successful completion returns the expected result and ordinary close/cancel returns `undefined`.
6. Verify any host-dependent target page only receives the required page-host contract through its intended routed-dialog entry path.

The source-level history and router coverage lives in:

- `zova/src/suite/cabloy-basic/modules/basic-app/test/lib/routedDialogHistory.test.ts`
- `zova/src/suite/cabloy-basic/modules/basic-app/test/lib/routedDialogRouter.test.ts`
- `repo-e2e/specs/routed-dialog.spec.ts`

For the source-confirmed production pattern, read:

- `zova/src/suite/cabloy-basic/modules/basic-resource/src/component/formFieldResourcePicker/controller.tsx`
- `zova/src/suite/cabloy-basic/modules/basic-resource/src/lib/resourcePickerPageHost.ts`
- `zova/src/suite-vendor/a-cabloy/modules/rest-resource/src/page/resourcePicker/controller.tsx`

## Read together with

- [Page Route Guide](/frontend/page-route-guide)
- [Page Params Guide](/frontend/page-params-guide)
- [Page Query Guide](/frontend/page-query-guide)
- [A-Router Guide](/frontend/a-router-guide)
- [Router View Hosts Guide](/frontend/router-view-hosts-guide)
- [Router Stack Guide](/frontend/router-stack-guide)
- [Module Scope](/frontend/module-scope)
- [SSR ClientOnly](/frontend/ssr-client-only)

## Final takeaway

A routed dialog is a client-only, isolated page-routing workflow inside modal chrome. Reuse ordinary page routes and ordinary Zova navigation; use typed props, session, page hosts, and results to express the workflow contract; and use the main router only for the browser route outside the dialog.
