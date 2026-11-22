import type { IComponentOptions, ISlot } from 'zova';

import { useId } from 'vue';
import { BeanControllerBase } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { ZIcon } from 'zova-module-a-icon';
import { ZButton } from 'zova-module-basic-button';

export interface ControllerRowOperationsProps {
  compact?: boolean;
  overflow?: boolean;
  popoverSupported?: boolean;
  class?: unknown;
  slotPrimary?: ISlot;
  slotOverflow?: ISlot;
}

@Controller()
export class ControllerRowOperations extends BeanControllerBase {
  static $propsDefault = { compact: false, overflow: false };
  static $componentOptions: IComponentOptions = { inheritAttrs: false };

  private _id: string;
  private _overflowId: string;
  private _rootRef?: HTMLDivElement;
  private _overflowRef?: HTMLDivElement;
  private _rootOpen = false;
  private _overflowOpen = false;
  private _positionFrame?: number;
  private _cPopover: string;
  private _onBeforeToggle: (event: ToggleEvent) => void;
  private _onViewportChange: (event: Event) => void;
  private _onKeydown: (event: KeyboardEvent) => void;
  private _onActionClick: (event: MouseEvent) => void;

  protected async __init__() {
    this._onActionClick = event => this._handleActionClick(event);
    this._onBeforeToggle = event => this._handleBeforeToggle(event);
    this._onKeydown = event => this._handleKeydown(event);
    this._onViewportChange = event => {
      const openElement = this._openElement();
      if (event.target instanceof Node && openElement?.contains(event.target)) return;
      this._close();
    };
    this._id = this.$composable(useId);
    this._overflowId = `${this._id}-overflow`;
    this._cPopover = this.$style({
      display: 'none',
      position: 'fixed',
      inset: 'auto',
      margin: 0,
      minWidth: '10rem',
      maxWidth: 'calc(100vw - 16px)',
      maxHeight: 'calc(100vh - 16px)',
      overflowY: 'auto',
      color: 'var(--color-base-content)',
      $nest: {
        '&:popover-open': {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          gap: '0.25rem',
        },
        '& .row-actions-group': {
          display: 'contents',
        },
        '& .row-actions-group > .btn': {
          position: 'relative',
          justifyContent: 'flex-start',
          width: '100%',
          height: 'auto',
          minHeight: '2.5rem',
          padding: '0.5rem 0.75rem',
          paddingInlineStart: 'calc(0.75rem + 24px + 0.5rem)',
          border: 0,
          borderRadius: 'var(--radius-field)',
          background: 'transparent',
          boxShadow: 'none',
          textShadow: 'none',
          textAlign: 'start',
          fontWeight: 500,
          translate: 'none',
        },
        '& .row-actions-group > .btn:not(:disabled):not(.btn-disabled):not([aria-disabled="true"])':
          {
            color: 'var(--color-base-content)',
          },
        '& .row-actions-group > .btn.btn-error:not(:disabled):not(.btn-disabled):not([aria-disabled="true"])':
          {
            color: 'var(--color-error)',
          },
        '& .row-actions-group > .btn:not(:disabled):not(.btn-disabled):not([aria-disabled="true"]):is(:hover, :focus-visible, :active)':
          {
            background: 'color-mix(in oklab, currentColor 8%, transparent)',
          },
        '& .row-actions-group > .btn:focus-visible': {
          outline: '2px solid currentColor',
          outlineOffset: '-2px',
        },
        '& .row-actions-group > .btn > :is(.zova-icon__svg, .zova-icon__img, .loading)': {
          position: 'absolute',
          insetInlineStart: '0.75rem',
          top: '50%',
          transform: 'translateY(-50%)',
        },
        '& .row-actions-group > .btn > .loading': {
          insetInlineStart: 'calc(0.75rem + 4px)',
        },
        '& .row-actions-group > .btn[aria-busy="true"] > :is(.zova-icon__svg, .zova-icon__img)': {
          visibility: 'hidden',
        },
        '& .row-actions-group > .btn:not(.btn-error) + .btn-error': {
          marginBlockStart: '0.5rem',
        },
        '& .row-actions-group > .btn:not(.btn-error) + .btn-error::before': {
          content: "''",
          position: 'absolute',
          insetInline: 0,
          top: '-0.375rem',
          borderTop: '1px solid var(--color-base-300)',
        },
        '&:has(.row-actions-primary-group > .btn-error) .row-actions-overflow-group > .btn-error': {
          marginBlockStart: 0,
        },
        '&:has(.row-actions-primary-group > .btn-error) .row-actions-overflow-group > .btn-error::before':
          {
            content: 'none',
            borderTop: 0,
          },
      },
    });
    this.$watch(
      () => this.$props.compact,
      () => this._close(),
      { flush: 'sync' },
    );
  }

  protected __dispose__() {
    this._close();
    this._setRootRef(undefined);
    this._setOverflowRef(undefined);
  }

  private _setRootRef(element?: HTMLDivElement) {
    if (element === this._rootRef) return;
    this._rootRef?.removeEventListener('beforetoggle', this._onBeforeToggle);
    this._rootRef?.removeEventListener('click', this._onActionClick, true);
    this._rootRef = element;
    element?.addEventListener('beforetoggle', this._onBeforeToggle);
    element?.addEventListener('click', this._onActionClick, true);
  }

  private _setOverflowRef(element?: HTMLDivElement) {
    if (element === this._overflowRef) return;
    this._overflowRef?.removeEventListener('beforetoggle', this._onBeforeToggle);
    this._overflowRef?.removeEventListener('click', this._onActionClick, true);
    this._overflowRef = element;
    element?.addEventListener('beforetoggle', this._onBeforeToggle);
    element?.addEventListener('click', this._onActionClick, true);
  }

  private _openElement() {
    if (this._rootOpen) return this._rootRef;
    if (this._overflowOpen) return this._overflowRef;
    return undefined;
  }

  private _handleBeforeToggle(event: ToggleEvent) {
    const element = event.target;
    if (element !== this._rootRef && element !== this._overflowRef) return;
    const isRoot = element === this._rootRef;
    if (event.newState === 'open') {
      this._rootOpen = isRoot;
      this._overflowOpen = !isRoot;
      const popup = element as HTMLDivElement;
      // beforetoggle precedes display; measure in the first frame after native opening.
      popup.style.visibility = 'hidden';
      this._positionFrame = window.requestAnimationFrame(() => {
        this._positionFrame = undefined;
        if (this._openElement() !== popup) return;
        this._position(popup);
        popup.style.removeProperty('visibility');
        const document = popup.ownerDocument;
        const trigger = document.getElementById(`${this._id}-trigger`);
        if (document.activeElement === trigger || document.activeElement === document.body) {
          popup
            .querySelector<HTMLElement>('button:not(:disabled), a[href], [tabindex="0"]')
            ?.focus({ preventScroll: true });
        }
        // Opening can follow scroll-into-view with its scroll event still queued.
        // Arm dismissal only after measuring the settled anchor and revealing the popup.
        window.addEventListener('scroll', this._onViewportChange, true);
      });
      window.addEventListener('resize', this._onViewportChange);
      popup.ownerDocument.addEventListener('keydown', this._onKeydown);
    } else {
      if (isRoot) this._rootOpen = false;
      else this._overflowOpen = false;
      if (!this._rootOpen && !this._overflowOpen) this._clearOpenState();
    }
  }

  private _clearOpenState() {
    this._rootOpen = false;
    this._overflowOpen = false;
    if (this._positionFrame !== undefined) {
      window.cancelAnimationFrame(this._positionFrame);
      this._positionFrame = undefined;
    }
    window.removeEventListener('scroll', this._onViewportChange, true);
    window.removeEventListener('resize', this._onViewportChange);
    this._rootRef?.ownerDocument.removeEventListener('keydown', this._onKeydown);
    this._overflowRef?.ownerDocument.removeEventListener('keydown', this._onKeydown);
    for (const element of [this._rootRef, this._overflowRef]) {
      element?.style.removeProperty('visibility');
      element?.style.removeProperty('left');
      element?.style.removeProperty('top');
    }
  }

  private _close() {
    const openElement = this._openElement();
    if (this._rootRef?.isConnected && this._rootRef.popover === 'auto') this._rootRef.hidePopover();
    if (this._overflowRef?.isConnected && this._overflowRef.popover === 'auto') {
      this._overflowRef.hidePopover();
    }
    if (openElement || this._rootOpen || this._overflowOpen) this._clearOpenState();
  }

  private _handleActionClick(event: MouseEvent) {
    const openElement = this._openElement();
    if (!openElement || !(event.target instanceof Element)) return;
    const action = event.target.closest('button, a[href], [role="button"]');
    if (
      !action ||
      !openElement.contains(action) ||
      action.matches(':disabled, [aria-disabled="true"]')
    ) {
      return;
    }
    this._close();
  }

  private _handleKeydown(event: KeyboardEvent) {
    if (event.key !== 'Escape' || event.defaultPrevented) return;
    if (event.target instanceof Element && event.target.closest('dialog[open], [role="dialog"]'))
      return;
    const element = this._openElement();
    const document = element?.ownerDocument;
    const activeElement = document?.activeElement;
    const trigger = document?.getElementById(`${this._id}-trigger`);
    if (!document || !activeElement || !element) return;
    if (activeElement.closest('dialog[open], [role="dialog"]')) return;
    if (
      activeElement !== document.body &&
      activeElement !== trigger &&
      !element.contains(activeElement)
    ) {
      return;
    }
    if (activeElement === document.body && document.querySelector('dialog:modal')) return;
    // A disabled action can leave focus on body; never claim unrelated focused controls.
    event.preventDefault();
    event.stopPropagation();
    this._close();
    if (trigger?.isConnected) trigger.focus({ preventScroll: true });
  }

  private _position(element: HTMLDivElement) {
    const trigger = element.ownerDocument.getElementById(`${this._id}-trigger`);
    if (!trigger) return;
    const anchor = trigger.getBoundingClientRect();
    const popup = element.getBoundingClientRect();
    const viewport = element.ownerDocument.documentElement;
    const margin = 8;
    const gap = 4;
    const left = Math.max(
      margin,
      Math.min(anchor.right - popup.width, viewport.clientWidth - popup.width - margin),
    );
    const below = anchor.bottom + gap;
    const above = anchor.top - gap - popup.height;
    const preferredTop =
      below + popup.height > viewport.clientHeight - margin && above >= margin ? above : below;
    const top = Math.max(
      margin,
      Math.min(preferredTop, viewport.clientHeight - popup.height - margin),
    );
    element.style.left = `${left}px`;
    element.style.top = `${top}px`;
  }

  protected render() {
    const { compact, overflow } = this.$props;
    const label = this.scope.locale.MoreActions();
    const overflowPopup = overflow && this.$props.popoverSupported !== false;
    const rootOpen = compact && this._rootOpen;
    const overflowOpen = overflowPopup && !compact && this._overflowOpen;
    return (
      <div class="inline-flex items-center">
        <div
          key="root"
          ref={ref => this._setRootRef((ref as HTMLDivElement | null) ?? undefined)}
          id={this._id}
          class={
            compact
              ? [this._cPopover, 'bg-base-100 border border-base-300 rounded-box shadow-lg p-2']
              : undefined
          }
          {...{ popover: compact ? 'auto' : undefined }}
          role={compact ? 'group' : undefined}
          aria-label={compact ? this.scope.locale.RowActions() : undefined}
        >
          <div
            class={[
              !compact ? this.$props.class : undefined,
              'row-actions-group row-actions-primary-group',
            ]}
          >
            {this.$props.slotPrimary?.()}
          </div>
          {overflow && (
            <div
              key="overflow"
              ref={ref => this._setOverflowRef((ref as HTMLDivElement | null) ?? undefined)}
              id={this._overflowId}
              class={
                overflowPopup && !compact
                  ? [this._cPopover, 'bg-base-100 border border-base-300 rounded-box shadow-lg p-2']
                  : undefined
              }
              {...{ popover: overflowPopup && !compact ? 'auto' : undefined }}
              role={overflowPopup && !compact ? 'group' : undefined}
              aria-label={overflowPopup && !compact ? this.scope.locale.RowActions() : undefined}
            >
              <div
                class={[
                  !compact && !overflowPopup ? this.$props.class : undefined,
                  'row-actions-group row-actions-overflow-group',
                ]}
              >
                {this.$props.slotOverflow?.()}
              </div>
            </div>
          )}
        </div>
        {(compact || overflowPopup) && (
          <ZButton
            key="trigger"
            id={`${this._id}-trigger`}
            class="btn btn-ghost btn-square"
            aria-label={label}
            title={label}
            aria-controls={compact ? this._id : this._overflowId}
            aria-expanded={rootOpen || overflowOpen}
            {...{
              'popovertarget': compact ? this._id : this._overflowId,
              'data-hydrate-ignore-popovertarget': '',
            }}
          >
            <ZIcon name="::more-horiz" width={24} aria-hidden="true" />
          </ZButton>
        )}
      </div>
    );
  }
}
