import type { Browser, BrowserContext, ConsoleMessage, Page, TestInfo } from '@playwright/test';

const maxRecords = 100;
const maxBytes = 32 * 1024;

export class BrowserDiagnostics {
  private readonly started = performance.now();
  private readonly contexts = new Set<BrowserContext>();
  private readonly pages = new WeakMap<Page, number>();
  private readonly disposers: Array<() => void> = [];
  private readonly records: string[] = [];
  private bytes = 0;
  private pageCount = 0;
  private dropped = 0;
  private consoleErrors = 0;
  private pageErrors = 0;
  private browser?: Browser;
  private readonly eventPattern?: RegExp;

  constructor(safeEvents: readonly string[] = []) {
    const literals = safeEvents
      .filter(Boolean)
      .map(event => event.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
    if (literals.length)
      this.eventPattern = new RegExp(`(?:^|\\s)(${literals.join('|')})(?=\\s|$)`);
  }

  observeBrowser(browser: Browser) {
    if (this.browser === browser) return;
    this.browser = browser;
    const observe = (context: BrowserContext) => this.observeContext(context);
    browser.on('context', observe);
    this.disposers.push(() => browser.off('context', observe));
    for (const context of browser.contexts()) this.observeContext(context);
  }

  private observeContext(context: BrowserContext) {
    if (this.contexts.has(context)) return;
    this.contexts.add(context);
    const onConsole = (message: ConsoleMessage) => {
      if (message.type() === 'error') {
        this.consoleErrors++;
        return;
      }
      if (!this.eventPattern || !['log', 'debug', 'info'].includes(message.type())) return;
      // Retain only a configured literal, never formatter metadata or arbitrary console text.
      const event = this.eventPattern.exec(message.text())?.[1];
      if (!event) return;
      const page = message.page();
      let label = page ? this.pages.get(page) : undefined;
      if (page && label === undefined) {
        label = ++this.pageCount;
        this.pages.set(page, label);
      }
      const record = `${Math.round(performance.now() - this.started)}ms page=${label ?? 'unknown'} ${event}`;
      const size = Buffer.byteLength(record);
      if (size > maxBytes) {
        this.dropped++;
        return;
      }
      while (
        this.records.length &&
        (this.records.length >= maxRecords || this.bytes + size > maxBytes)
      ) {
        this.bytes -= Buffer.byteLength(this.records.shift()!);
        this.dropped++;
      }
      this.records.push(record);
      this.bytes += size;
    };
    const onError = () => {
      this.pageErrors++;
    };
    context.on('console', onConsole);
    context.on('weberror', onError);
    this.disposers.push(() => {
      context.off('console', onConsole);
      context.off('weberror', onError);
    });
  }

  dispose() {
    for (const dispose of this.disposers.splice(0)) dispose();
    this.contexts.clear();
    this.browser = undefined;
  }

  hasEvent(page: Page, event: string) {
    const label = this.pages.get(page);
    return (
      label !== undefined && this.records.some(record => record.endsWith(` page=${label} ${event}`))
    );
  }

  summary(tail = maxRecords) {
    return [
      `browser diagnostics: consoleErrors=${this.consoleErrors} pageErrors=${this.pageErrors} dropped=${this.dropped}`,
      ...this.records.slice(-tail),
    ].join('\n');
  }

  async report(
    testInfo: Pick<
      TestInfo,
      'status' | 'expectedStatus' | 'testId' | 'retry' | 'project' | 'attach'
    >,
    runId: string,
    write: (message: string) => void = message => console.warn(message),
  ) {
    if (testInfo.status === testInfo.expectedStatus) return;
    const attribution = JSON.stringify({
      runId,
      testId: testInfo.testId,
      project: testInfo.project.name,
      retry: testInfo.retry,
    });
    try {
      await testInfo.attach('browser-diagnostics', {
        body: `${attribution}\n${this.summary()}`,
        contentType: 'text/plain',
      });
    } catch {
      // Reporting must not replace the original test failure.
    }
    try {
      write(`${attribution}\n${this.summary(20)}`);
    } catch {
      // Keep terminal reporting independent from attachment availability.
    }
  }
}
