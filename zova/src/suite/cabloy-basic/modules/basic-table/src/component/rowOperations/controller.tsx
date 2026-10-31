import type { IComponentOptions, ISlot } from 'zova';

import { useId } from 'vue';
import { BeanControllerBase } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { ZIcon } from 'zova-module-a-icon';
import { ZButton } from 'zova-module-basic-button';

export interface ControllerRowOperationsProps {
  compact?: boolean;
  class?: unknown;
  slotDefault?: ISlot;
}

@Controller()
export class ControllerRowOperations extends BeanControllerBase {
  static $propsDefault = { compact: false };
  static $componentOptions: IComponentOptions = { inheritAttrs: false };

  private _id: string;
  private _actionsRef?: HTMLDivElement;
  private _open = false;
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
      if (event.target instanceof Node && this._actionsRef?.contains(event.target)) return;
      this._close();
    };
    this._id = this.$composable(useId);
    this._cPopover = this.$style({
      display: 'none',
      position: 'fixed',
      inset: 'auto',
      margin: 0,
      minWidth: '10rem',
      maxWidth: 'calc(100vw - 16px)',
      maxHeight: 'calc(100vh - 16px)',
      overflowY: 'auto',
      $nest: {
        '&:popover-open': {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'stretch',
          gap: '0.25rem',
        },
        '& > .btn': {
          justifyContent: 'flex-start',
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
    this._setActionsRef(undefined);
  }

  private _setActionsRef(element?: HTMLDivElement) {
    if (element === this._actionsRef) return;
    this._actionsRef?.removeEventListener('beforetoggle', this._onBeforeToggle);
    this._actionsRef?.removeEventListener('click', this._onActionClick, true);
    this._actionsRef = element;
    element?.addEventListener('beforetoggle', this._onBeforeToggle);
    element?.addEventListener('click', this._onActionClick, true);
  }

  private _handleBeforeToggle(event: ToggleEvent) {
    if (event.target !== this._actionsRef) return;
    this._open = event.newState === 'open';
    if (this._open) {
      // beforetoggle precedes display; measure in the first frame after native opening.
      this._actionsRef!.style.visibility = 'hidden';
      this._positionFrame = window.requestAnimationFrame(() => {
        this._positionFrame = undefined;
        if (!this._open) return;
        this._position();
        const element = this._actionsRef;
        element?.style.removeProperty('visibility');
        const document = element?.ownerDocument;
        if (
          document &&
          (document.activeElement?.id === `${this._id}-trigger` ||
            document.activeElement === document.body)
        ) {
          element
            ?.querySelector<HTMLElement>('button:not(:disabled), a[href], [tabindex="0"]')
            ?.focus({ preventScroll: true });
        }
        // Opening can follow scroll-into-view with its scroll event still queued.
        // Arm dismissal only after measuring the settled anchor and revealing the popup.
        window.addEventListener('scroll', this._onViewportChange, true);
      });
      window.addEventListener('resize', this._onViewportChange);
      this._actionsRef!.ownerDocument.addEventListener('keydown', this._onKeydown);
    } else {
      this._clearOpenState();
    }
  }

  private _clearOpenState() {
    this._open = false;
    if (this._positionFrame !== undefined) {
      window.cancelAnimationFrame(this._positionFrame);
      this._positionFrame = undefined;
    }
    window.removeEventListener('scroll', this._onViewportChange, true);
    window.removeEventListener('resize', this._onViewportChange);
    this._actionsRef?.ownerDocument.removeEventListener('keydown', this._onKeydown);
    this._actionsRef?.style.removeProperty('visibility');
    this._actionsRef?.style.removeProperty('left');
    this._actionsRef?.style.removeProperty('top');
  }

  private _close() {
    if (!this._open) return;
    const element = this._actionsRef;
    if (element?.isConnected && element.popover === 'auto') element.hidePopover();
    this._clearOpenState();
  }

  private _handleActionClick(event: MouseEvent) {
    if (!this.$props.compact || !this._open || !(event.target instanceof Element)) return;
    const action = event.target.closest('button, a[href], [role="button"]');
    if (
      !action ||
      !this._actionsRef?.contains(action) ||
      action.matches(':disabled, [aria-disabled="true"]')
    ) {
      return;
    }
    this._close();
  }

  private _handleKeydown(event: KeyboardEvent) {
    if (event.key !== 'Escape' || event.defaultPrevented || !this._open) return;
    if (event.target instanceof Element && event.target.closest('dialog[open], [role="dialog"]'))
      return;
    const element = this._actionsRef;
    const document = element?.ownerDocument;
    const activeElement = document?.activeElement;
    const trigger = document?.getElementById(`${this._id}-trigger`);
    if (!document || !activeElement) return;
    if (activeElement.closest('dialog[open], [role="dialog"]')) return;
    if (
      activeElement !== document.body &&
      activeElement !== trigger &&
      !element?.contains(activeElement)
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

  private _position() {
    const element = this._actionsRef;
    const trigger = element?.ownerDocument.getElementById(`${this._id}-trigger`);
    if (!element || !trigger) return;
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
    const { compact } = this.$props;
    const label = this.scope.locale.MoreActions();
    return (
      <div class="inline-flex items-center">
        {compact && (
          <ZButton
            key="trigger"
            id={`${this._id}-trigger`}
            class="btn btn-ghost btn-square"
            aria-label={label}
            aria-controls={this._id}
            aria-expanded={this._open}
            {...{ 'popovertarget': this._id, 'data-hydrate-ignore-popovertarget': '' }}
          >
            <ZIcon name="::more-horiz" width={24} aria-hidden="true" />
          </ZButton>
        )}
        <div
          key="actions"
          ref={ref => this._setActionsRef((ref as HTMLDivElement | null) ?? undefined)}
          id={this._id}
          class={
            compact
              ? [this._cPopover, 'bg-base-100 border border-base-300 rounded-box shadow-lg p-2']
              : this.$props.class
          }
          {...{ popover: compact ? 'auto' : undefined }}
          role="group"
          aria-label={this.scope.locale.RowActions()}
        >
          {this.$slotDefault?.()}
        </div>
      </div>
    );
  }
}
