import type { VNode } from 'vue';

import { BeanBase, cast, deepEqual, disposeInstance, Use } from 'zova';
import { IOnionItem, IOnionSlice, Service, SysOnion, TypeComposer } from 'zova-module-a-bean';

import type { BeanBehaviorBase } from '../bean/bean.behaviorBase.js';
import type {
  IBehaviorRecord,
  IBehaviors,
  IDecoratorBehaviorOptions,
  NextBehavior,
} from '../types/behavior.js';

const SymbolSliceOptionsOriginal = Symbol('SymbolSliceOptionsOriginal');

@Service()
export class ServiceComposer extends BeanBase {
  private _composer: TypeComposer;
  private _onionSlicesOriginal?: IOnionSlice<
    IDecoratorBehaviorOptions,
    keyof IBehaviorRecord,
    BeanBehaviorBase
  >[];

  @Use()
  $$sysOnion: SysOnion;

  protected async __init__(behaviors: IBehaviors) {
    await this.load(behaviors);
  }

  protected __dispose__() {
    if (this._onionSlicesOriginal) {
      for (const onionSlice of this._onionSlicesOriginal) {
        disposeInstance(onionSlice.beanInstance);
      }
    }
  }

  public async load(behaviors: IBehaviors) {
    await this.$renderFreezeScope(async () => {
      await this._loadInner(behaviors);
    });
  }

  private async _loadInner(behaviors: IBehaviors) {
    // onionItems
    const onionItems = this._prepareOnionItems(behaviors);
    // load onions
    const onionSlices = await this.$$sysOnion.behavior.loadOnions<BeanBehaviorBase>(onionItems);
    // create behaviors
    for (const onionSlice of onionSlices) {
      const onionSliceOriginal = this._onionSlicesOriginal?.find(
        item => item.beanFullName === onionSlice.beanFullName,
      );
      if (onionSliceOriginal) {
        onionSlice.beanInstance = onionSliceOriginal.beanInstance;
        if (!deepEqual(onionSliceOriginal[SymbolSliceOptionsOriginal], onionSlice.options)) {
          await cast(onionSlice.beanInstance).onOptionsChange(onionSlice.options);
        }
      } else {
        onionSlice.beanInstance = await this.bean._newBean(
          onionSlice.beanFullName as any,
          true,
          onionSlice.options,
        );
      }
      onionSlice[SymbolSliceOptionsOriginal] = onionSlice.options;
    }
    // dispose original behaviors
    if (this._onionSlicesOriginal) {
      for (const onionSlice of this._onionSlicesOriginal) {
        const exists = onionSlices.find(item => item.beanFullName === onionSlice.beanFullName);
        if (!exists) {
          disposeInstance(onionSlice.beanInstance);
        }
      }
    }
    // save
    this._onionSlicesOriginal = onionSlices;
    // compose
    this._composer = this.$$sysOnion.behavior.compose(
      onionSlices,
      (onionSlice, props: any, next) => {
        const beanInstance = cast<BeanBehaviorBase>(onionSlice.beanInstance);
        return cast(beanInstance).render(props, next as any);
      },
    );
  }

  public render<PROPS_INPUT, PROPS_OUTPUT = PROPS_INPUT>(
    props: PROPS_INPUT,
    next: NextBehavior<PROPS_OUTPUT>,
  ): VNode {
    return this._composer(props, next);
  }

  private _prepareOnionItems(behaviors: IBehaviors) {
    const onionItems: IOnionItem<IDecoratorBehaviorOptions, keyof IBehaviorRecord>[] = [];
    return this._prepareOnionItemsInner(onionItems, behaviors);
  }

  private _prepareOnionItemsInner(
    onionItems: IOnionItem<IDecoratorBehaviorOptions, keyof IBehaviorRecord>[],
    behaviors: IBehaviors,
  ) {
    const behaviors2 = Array.isArray(behaviors) ? behaviors : [behaviors];
    for (const behaviorItem of behaviors2) {
      if (typeof behaviorItem === 'string') {
        onionItems.push({
          name: behaviorItem as unknown as keyof IBehaviorRecord,
          options: undefined,
        });
      } else if (Array.isArray(behaviorItem)) {
        this._prepareOnionItemsInner(onionItems, behaviorItem);
      } else if (typeof behaviorItem === 'object') {
        for (const key in behaviorItem) {
          let options = behaviorItem[key];
          if (options === false) continue;
          if (options === true) options = undefined;
          onionItems.push({ name: key as unknown as keyof IBehaviorRecord, options });
        }
      }
    }
    return onionItems;
  }
}
