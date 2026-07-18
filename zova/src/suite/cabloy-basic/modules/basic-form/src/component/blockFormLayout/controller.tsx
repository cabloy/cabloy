import type { IComponentOptions } from 'zova';
import type {
  IJsxRenderContextForm,
  IResolvedFormLayout,
  IResolvedFormLayoutField,
  IResolvedFormLayoutGroup,
  IResolvedFormLayoutNode,
  IResolvedFormLayoutSection,
  IResolvedFormLayoutTab,
  IResolvedFormLayoutTabs,
} from 'zova-module-a-form';
import type {
  IFormLayout,
  IFormLayoutResponsiveColumns,
  IResourceBlockOptionsBase,
  TypeFormLayoutColumns,
} from 'zova-module-a-openapi';

import { classes } from 'typestyle';
import { useId } from 'vue';
import { BeanControllerBase, Use } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { resolveFormLayout } from 'zova-module-a-form';

const gridClasses: Record<
  'grid-cols' | 'col-span',
  Record<'default' | 'md' | 'lg', Record<TypeFormLayoutColumns, string>>
> = {
  'grid-cols': {
    default: { 1: 'grid-cols-1', 2: 'grid-cols-2', 3: 'grid-cols-3', 4: 'grid-cols-4' },
    md: { 1: 'md:grid-cols-1', 2: 'md:grid-cols-2', 3: 'md:grid-cols-3', 4: 'md:grid-cols-4' },
    lg: { 1: 'lg:grid-cols-1', 2: 'lg:grid-cols-2', 3: 'lg:grid-cols-3', 4: 'lg:grid-cols-4' },
  },
  'col-span': {
    default: { 1: 'col-span-1', 2: 'col-span-2', 3: 'col-span-3', 4: 'col-span-4' },
    md: { 1: 'md:col-span-1', 2: 'md:col-span-2', 3: 'md:col-span-3', 4: 'md:col-span-4' },
    lg: { 1: 'lg:col-span-1', 2: 'lg:col-span-2', 3: 'lg:col-span-3', 4: 'lg:col-span-4' },
  },
};

declare module 'zova-module-a-openapi' {
  export interface IResourceBlockRecord {
    'basic-form:blockFormLayout'?: ControllerBlockFormLayoutProps;
  }
}

export interface ControllerBlockFormLayoutProps extends IResourceBlockOptionsBase {
  formLayout: IFormLayout;
}

@Controller()
export class ControllerBlockFormLayout extends BeanControllerBase {
  static $propsDefault = {};
  static $componentOptions: IComponentOptions = { inheritAttrs: false, deepExtendDefault: true };

  private formLayoutPlan: IResolvedFormLayout | undefined;
  private formLayoutActiveTabs: Record<string, string | undefined> = {};
  private formLayoutDomIdPrefix: string;

  @Use({ injectionScope: 'host' })
  $$renderContext: IJsxRenderContextForm;

  protected async __init__() {
    this.formLayoutDomIdPrefix = `basic-form-layout-${useId()}`;
    this.formLayoutPlan = this.$computed(() => {
      const { $$form } = this.$$renderContext;
      const formLayout = this.$props.formLayout;
      return resolveFormLayout(formLayout, $$form.properties);
    });
  }

  protected render() {
    const plan = this.formLayoutPlan!;
    return <>{plan.children.map(node => this._renderNode(node))}</>;
  }

  private _renderNode(node: IResolvedFormLayoutNode) {
    switch (node.type) {
      case 'field':
        return this._renderField(node);
      case 'group':
        return this._renderGroup(node);
      case 'section':
        return this._renderSection(node);
      case 'tabs':
        return this._renderTabs(node);
    }
  }

  private _renderField(node: IResolvedFormLayoutField, sectionLayout?: 'grid' | 'flow') {
    const { $$form } = this.$$renderContext;
    const className =
      sectionLayout === 'flow' ? 'min-w-0 max-w-full' : this._gridClasses('col-span', node.span);
    return <div class={className}>{$$form.renderField(node.name)}</div>;
  }

  private _renderGroup(node: IResolvedFormLayoutGroup) {
    return (
      <fieldset class="fieldset mb-6 rounded-box border border-base-300 p-4">
        {!!node.title && <legend class="fieldset-legend">{node.title}</legend>}
        {!!node.description && <p class="mb-4 text-sm text-base-content/70">{node.description}</p>}
        {node.children.map(child => this._renderNode(child))}
      </fieldset>
    );
  }

  private _renderSection(node: IResolvedFormLayoutSection) {
    const layout = node.layout ?? 'grid';
    const className =
      layout === 'flow'
        ? 'mb-6 flex flex-wrap items-start gap-4'
        : classes('mb-6 grid gap-4', this._gridClasses('grid-cols', node.columns));
    return (
      <section>
        {!!node.title && <h3 class="mb-1 text-lg font-semibold">{node.title}</h3>}
        {!!node.description && <p class="mb-4 text-sm text-base-content/70">{node.description}</p>}
        <div class={className}>{node.children.map(child => this._renderField(child, layout))}</div>
      </section>
    );
  }

  private getActiveTabId(node: IResolvedFormLayoutTabs) {
    const activeTabId = this.formLayoutActiveTabs[node.id];
    if (node.children.some(tab => tab.id === activeTabId)) return activeTabId;
    const fallbackTabId = node.children[0]?.id;
    this.formLayoutActiveTabs[node.id] = fallbackTabId;
    return fallbackTabId;
  }

  private setActiveTab(tabsId: string, tabId: string) {
    this.formLayoutActiveTabs[tabsId] = tabId;
  }

  private _renderTabs(node: IResolvedFormLayoutTabs) {
    const { $$form } = this.$$renderContext;
    const activeTabId = this.getActiveTabId(node);
    const domIdBase = `${this.formLayoutDomIdPrefix}-${node.id}`;
    return (
      <div class="mb-6">
        <div role="tablist" class="tabs tabs-lifted">
          {node.children.map(tab => {
            const active = tab.id === activeTabId;
            const errorFieldCount = $$form.getErrorFieldCount(tab);
            const invalid = errorFieldCount > 0;
            return (
              <button
                id={`${domIdBase}-${tab.id}-tab`}
                role="tab"
                type="button"
                class={classes('tab', active && 'tab-active')}
                aria-selected={active}
                aria-controls={`${domIdBase}-${tab.id}-panel`}
                onClick={() => this.setActiveTab(node.id, tab.id)}
              >
                {tab.title}
                {invalid && <span class="badge badge-error badge-sm ml-1">{errorFieldCount}</span>}
              </button>
            );
          })}
        </div>
        {node.children.map(tab => this._renderTabPanel(domIdBase, tab, tab.id === activeTabId))}
      </div>
    );
  }

  private _renderTabPanel(domIdBase: string, tab: IResolvedFormLayoutTab, active: boolean) {
    return (
      <div
        id={`${domIdBase}-${tab.id}-panel`}
        role="tabpanel"
        aria-labelledby={`${domIdBase}-${tab.id}-tab`}
        hidden={!active}
        class="rounded-box border border-base-300 bg-base-100 p-4"
      >
        {tab.children.map(child => this._renderNode(child))}
      </div>
    );
  }

  private _gridClasses(prefix: 'grid-cols' | 'col-span', columns?: IFormLayoutResponsiveColumns) {
    const classNames: string[] = [];
    const valueDefault = columns?.default ?? (prefix === 'grid-cols' ? 1 : undefined);
    if (valueDefault) classNames.push(gridClasses[prefix].default[valueDefault]);
    if (columns?.md) classNames.push(gridClasses[prefix].md[columns.md]);
    if (columns?.lg) classNames.push(gridClasses[prefix].lg[columns.lg]);
    return classNames.join(' ');
  }
}
