import type { ZovaConfigEnv } from 'zova';

import { BeanControllerPageBase } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { ZButton } from 'zova-module-basic-button';
import { ZPage } from 'zova-module-home-base';

import { getMcpResource } from '../../lib/mcpResource.ts';

const skillsUrl = 'https://github.com/cabloy/cabloy/tree/main/repo-client-governance/skills/';

function normalizeToken(value: string | undefined, fallback: string) {
  const normalized = (value ?? '')
    .normalize('NFKD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
  return normalized || fallback;
}

function getConnectionName(env: ZovaConfigEnv) {
  return [
    normalizeToken(env.APP_NAME, 'cabloy'),
    normalizeToken(env.SITE_ID, 'default'),
    normalizeToken(env.META_MODE, 'development'),
  ].join('_');
}

@Controller()
export class ControllerPageQuickStart extends BeanControllerPageBase {
  private async _copy(text: string) {
    await this.$performCommand('basic-commands:copy', { text });
  }

  protected render() {
    const connectionName = getConnectionName(this.sys.env);
    const resource = getMcpResource(this.sys.env);
    const firstPrompt = this.scope.locale.McpQuickStartPrompt1(skillsUrl, connectionName, resource);
    const thirdPrompt = this.scope.locale.McpQuickStartPrompt3(connectionName);
    return (
      <ZPage>
        <section data-testid="mcp-quick-start" class="mx-auto max-w-4xl space-y-6 p-6">
          <div>
            <h1 class="text-3xl font-semibold">{this.scope.locale.McpQuickStart()}</h1>
            <p class="mt-2 text-base-content/70">{this.scope.locale.McpQuickStartIntro()}</p>
          </div>
          <div class="space-y-4">
            <article
              data-testid="mcp-quick-start-card-1"
              class="card border border-base-300 bg-base-100 shadow-sm"
            >
              <div class="card-body gap-4">
                <h2 class="card-title">1. {this.scope.locale.McpQuickStartCard1()}</h2>
                <p>{this.scope.locale.McpQuickStartPromptHelp()}</p>
                <pre
                  data-testid="mcp-quick-start-prompt-1"
                  data-connection-name={connectionName}
                  data-mcp-resource={resource}
                  class="whitespace-pre-wrap break-words rounded-box bg-base-200 p-4 text-sm"
                >
                  <code>{firstPrompt}</code>
                </pre>
                <p class="text-sm text-base-content/70">
                  {this.scope.locale.McpQuickStartNameHelp()}
                </p>
                <div class="flex flex-wrap gap-2">
                  <ZButton
                    data-testid="mcp-quick-start-copy-prompt-1"
                    class="btn btn-outline btn-sm"
                    onPerform={() => this._copy(firstPrompt)}
                  >
                    {this.scope.locale.McpQuickStartCopy()}
                  </ZButton>
                </div>
              </div>
            </article>
            <article
              data-testid="mcp-quick-start-card-2"
              class="card border border-base-300 bg-base-100 shadow-sm"
            >
              <div class="card-body">
                <h2 class="card-title">2. {this.scope.locale.McpQuickStartCard2()}</h2>
                <p>{this.scope.locale.McpQuickStartAuthorize()}</p>
              </div>
            </article>
            <article
              data-testid="mcp-quick-start-card-3"
              class="card border border-base-300 bg-base-100 shadow-sm"
            >
              <div class="card-body gap-4">
                <h2 class="card-title">3. {this.scope.locale.McpQuickStartCard3()}</h2>
                <pre
                  data-testid="mcp-quick-start-prompt-3"
                  class="whitespace-pre-wrap break-words rounded-box bg-base-200 p-4 text-sm"
                >
                  <code>{thirdPrompt}</code>
                </pre>
                <ZButton
                  data-testid="mcp-quick-start-copy-prompt-3"
                  class="btn btn-outline btn-sm self-start"
                  onPerform={() => this._copy(thirdPrompt)}
                >
                  {this.scope.locale.McpQuickStartCopy()}
                </ZButton>
              </div>
            </article>
          </div>
        </section>
      </ZPage>
    );
  }
}
