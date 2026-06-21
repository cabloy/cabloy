import { celEnvBase } from '@cabloy/utils';
import { VNode } from 'vue';
import { BeanControllerBase, IComponentOptions } from 'zova';
import { ZovaJsx } from 'zova-jsx';
import { Controller } from 'zova-module-a-bean';
import {
  IDetailsScope,
  IJsxRenderContextDetails,
  IPermissionHintDetailsActionBulk,
  IResourceBlockOptionsBase,
  IResourceRenderBlockOptionsBlock,
  ISchemaObjectExtensionField,
  TypeFormScene,
} from 'zova-module-a-openapi';
import { BeanControllerTableBase } from 'zova-module-a-table';

declare module 'zova-module-a-openapi' {
  export interface IResourceBlockRecord {
    'basic-details:blockDetails'?: ControllerBlockDetailsProps;
  }
}

export interface ControllerBlockDetailsProps<
  TData extends {} = {},
> extends IResourceBlockOptionsBase {
  blocks?: IResourceRenderBlockOptionsBlock[];
  formScene?: TypeFormScene;
  schemaRow?: ISchemaObjectExtensionField;
  getDetailItems?: () => TData[] | undefined;
  setDetailItems?: (detailItems: TData[]) => void;
}

@Controller()
export class ControllerBlockDetails<TData extends {} = {}> extends BeanControllerBase {
  static $propsDefault = {};
  static $componentOptions: IComponentOptions = { inheritAttrs: false, deepExtendDefault: true };

  tableRef: BeanControllerTableBase<TData>;

  jsxZova: ZovaJsx;
  jsxCelScope: IDetailsScope;
  jsxRenderContext: IJsxRenderContextDetails<TData>;

  protected async __init__() {
    // jsx
    this._prepareJsx();
  }

  get data() {
    return this.$props.getDetailItems?.() ?? [];
  }

  get formScene() {
    return this.$props.formScene!;
  }

  get schemaRow() {
    return this.$props.schemaRow!;
  }

  public checkPermission(permissionHint?: IPermissionHintDetailsActionBulk): boolean {
    const formScene = this.formScene;
    const formSceneHint = permissionHint?.formScene;
    if (!formSceneHint) return true;
    if (Array.isArray(formSceneHint) && formSceneHint.includes(formScene!)) return true;
    if (formSceneHint === formScene) return true;
    return false;
  }

  private _prepareJsx() {
    const jsxCelEnv = celEnvBase.clone();
    this.jsxZova = this.bean._newBeanSimple(ZovaJsx, false, undefined, jsxCelEnv);
    this.jsxCelScope = this._prepareJsxCelScope();
    this.jsxRenderContext = {
      app: this.app,
      ctx: this.ctx,
      $scene: 'details',
      $host: this,
      $celScope: this.jsxCelScope,
      $jsx: this.jsxZova,
      $$details: this,
    };
  }

  private _prepareJsxCelScope(): IDetailsScope {
    return {};
  }

  protected render() {
    return <div class={this.$props.class}>{this._renderBlocks()}</div>;
  }

  private _renderBlocks() {
    const blocks = this.$props.blocks;
    if (!blocks || blocks.length === 0) return;
    const domBlocks: VNode[] = [];
    blocks.forEach((block, index) => {
      const options = Object.assign({ key: index }, block.options);
      const domBlock = this.jsxZova.render(
        block.render!,
        options,
        this.jsxCelScope,
        this.jsxRenderContext,
      );
      if (!domBlock) return;
      if (Array.isArray(domBlock)) {
        domBlocks.push(...domBlock);
      } else {
        domBlocks.push(domBlock);
      }
    });
    return domBlocks;
  }
}
