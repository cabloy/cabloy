import type {
  BeanControllerTableBase,
  ControllerTable as ControllerTableInner,
  ControllerTableProps as ControllerTablePropsSuper,
} from 'zova-module-a-table';

import { BeanControllerBase } from 'zova';
import { Controller } from 'zova-module-a-bean';

export interface ControllerTableProps<
  TData extends {} = {},
> extends ControllerTablePropsSuper<TData> {
  compactBreakpoint?: number | false;
  tableRef?: (ref: BeanControllerTableBase<TData>) => void;
}

@Controller()
export class ControllerTable extends BeanControllerBase {
  static $propsDefault = { compactBreakpoint: 768 };

  innerTable?: ControllerTableInner<any>;
  containerWidth: number = 0;
  popoverSupported: boolean = false;
  private _container?: HTMLElement;
  private _observer?: ResizeObserver;
  private _mounted: boolean = false;
  private _disposed: boolean = false;

  protected async __init__() {
    this.$controllerMounted(() => {
      this.$ssr.handleDirectOrOnHydrated(() => {
        if (this._disposed) return;
        this._mounted = true;
        this.popoverSupported = typeof HTMLElement.prototype.showPopover === 'function';
        this._observeContainer();
      });
    });
  }

  public get compact() {
    const breakpoint = this.$props.compactBreakpoint;
    return (
      this.popoverSupported &&
      breakpoint !== false &&
      this.containerWidth > 0 &&
      this.containerWidth < (breakpoint ?? 768)
    );
  }

  public get columnSizing() {
    const sizing = { ...this.$props.columnSizing };
    if (this.compact) {
      for (const property of this.innerTable?.tableMeta?.properties ?? []) {
        if (this.isOperationsColumn(property.key!)) sizing[property.key!] = 80;
      }
    }
    return sizing;
  }

  public isOperationsColumn(key: string) {
    const table = this.innerTable;
    if (!table) return false;
    const scope = table.getColumnScope(key);
    const { render } = table.getColumnComponentPropsTop(key, scope, {});
    return table.getRenderProvider(render) === 'basic-table.tableCell.actionOperationsRow';
  }

  public setContainer(element: HTMLElement | undefined) {
    if (element === this._container) return;
    this._observer?.disconnect();
    this._container = element;
    this._observeContainer();
  }

  private _observeContainer() {
    const container = this._container;
    if (!this._mounted || this._disposed || !container) return;
    this._observer?.disconnect();
    const measure = () => {
      if (this._disposed || container !== this._container) return;
      this.containerWidth = container.clientWidth;
    };
    measure();
    this._observer = new ResizeObserver(measure);
    this._observer.observe(container);
  }

  protected __dispose__() {
    this._disposed = true;
    this._observer?.disconnect();
    this._container = undefined;
  }
}
