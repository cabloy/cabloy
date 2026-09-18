import { z } from 'zod';
import { BeanControllerPageBase } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { ZPage } from 'zova-module-home-base';

import {
  ZControllerBoundaryProbe,
  ZControllerBoundaryProbeInline,
  ZControllerBoundaryProbeOverride,
} from '../../.metadata/index.jsx';

export const ControllerPageControllerBoundarySchemaParams = z.object({});

export const ControllerPageControllerBoundarySchemaQuery = z.object({
  mode: z.enum(['serverFailure', 'inlineServerFailure']).optional(),
});

type ProbeMode = 'success' | 'failure' | 'serverFailure';
type InlineProbeMode = 'success' | 'failure' | 'serverFailure';

@Controller()
export class ControllerPageControllerBoundary extends BeanControllerPageBase {
  probe?: { mode: ProbeMode; delayMs: number };
  inlineProbe?: { mode: InlineProbeMode; delayMs: number };
  overrideProbe?: { mode: 'success' | 'failure'; delayMs: number };
  probeKey = 0;
  inlineProbeKey = 0;
  overrideProbeKey = 0;

  protected async __init__() {
    if (this.$query.mode === 'serverFailure') {
      this.probe = { mode: 'serverFailure', delayMs: 0 };
    } else if (this.$query.mode === 'inlineServerFailure') {
      this.inlineProbe = { mode: 'serverFailure', delayMs: 0 };
    }
  }

  mountFastSuccess() {
    this._mountProbe('success', 300);
  }

  mountFastFailure() {
    this._mountProbe('failure', 300);
  }

  mountDelayedSuccess() {
    this._mountProbe('success', 800);
  }

  mountFailingProbe() {
    this._mountProbe('failure', 800);
  }

  prepareProbeRetrySuccess() {
    if (!this.probe) return;
    this.probe = { mode: 'success', delayMs: 800 };
  }

  clearProbe() {
    this.probe = undefined;
  }

  mountInlineFailingProbe() {
    this._mountInlineProbe('failure', 800);
  }

  prepareInlineRetrySuccess() {
    if (!this.inlineProbe) return;
    this.inlineProbe = { mode: 'success', delayMs: 800 };
  }

  clearInlineProbe() {
    this.inlineProbe = undefined;
  }

  mountOverrideFailingProbe() {
    this.overrideProbe = { mode: 'failure', delayMs: 2_000 };
    this.overrideProbeKey++;
  }

  recoverOverrideWithDelayedSuccess() {
    this.overrideProbe = { mode: 'success', delayMs: 2_000 };
    this.overrideProbeKey++;
  }

  clearOverrideProbe() {
    this.overrideProbe = undefined;
  }

  private _mountProbe(mode: ProbeMode, delayMs: number) {
    this.probe = { mode, delayMs };
    this.probeKey++;
  }

  private _mountInlineProbe(mode: InlineProbeMode, delayMs: number) {
    this.inlineProbe = { mode, delayMs };
    this.inlineProbeKey++;
  }

  protected render() {
    return (
      <ZPage>
        <h1>Controller Boundary Manual Validation</h1>
        <p>
          Mount a fresh child Controller to exercise the global loading and error boundary
          renderers.
        </p>
        <div class="flex flex-wrap gap-2">
          <button class="btn btn-primary" onClick={() => this.mountFastSuccess()}>
            Mount fast success probe
          </button>
          <button class="btn btn-error" onClick={() => this.mountFastFailure()}>
            Mount fast failing probe
          </button>
          <button class="btn btn-primary" onClick={() => this.mountDelayedSuccess()}>
            Mount delayed success probe
          </button>
          <button class="btn btn-error" onClick={() => this.mountFailingProbe()}>
            Mount failing probe
          </button>
          <button class="btn btn-secondary" onClick={() => this.prepareProbeRetrySuccess()}>
            Prepare probe retry success
          </button>
          <button class="btn" onClick={() => this.clearProbe()}>
            Clear probe
          </button>
        </div>
        <div class="mt-4">
          {this.probe && (
            <ZControllerBoundaryProbe
              key={this.probeKey}
              mode={this.probe.mode}
              delayMs={this.probe.delayMs}
            />
          )}
        </div>
        <div class="mt-4">
          <button class="btn btn-error" onClick={() => this.mountInlineFailingProbe()}>
            Mount inline failing probe
          </button>
          <button class="btn btn-secondary ml-2" onClick={() => this.prepareInlineRetrySuccess()}>
            Prepare inline retry success
          </button>
          <button class="btn ml-2" onClick={() => this.clearInlineProbe()}>
            Clear inline probe
          </button>
          <p class="mt-2">
            Inline boundary:{' '}
            {this.inlineProbe && (
              <ZControllerBoundaryProbeInline
                key={this.inlineProbeKey}
                mode={this.inlineProbe.mode}
                delayMs={this.inlineProbe.delayMs}
              />
            )}
          </p>
        </div>
        <div class="mt-4">
          <button class="btn btn-error" onClick={() => this.mountOverrideFailingProbe()}>
            Mount override failing probe
          </button>
          <button
            class="btn btn-secondary ml-2"
            onClick={() => this.recoverOverrideWithDelayedSuccess()}
          >
            Recover override with delayed success
          </button>
          <button class="btn ml-2" onClick={() => this.clearOverrideProbe()}>
            Clear override probe
          </button>
          <p class="mt-2">
            Override boundary:{' '}
            {this.overrideProbe && (
              <ZControllerBoundaryProbeOverride
                key={this.overrideProbeKey}
                mode={this.overrideProbe.mode}
                delayMs={this.overrideProbe.delayMs}
              />
            )}
          </p>
        </div>
      </ZPage>
    );
  }
}
