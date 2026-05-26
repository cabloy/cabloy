import { BeanSimple } from '../bean/beanSimple.ts';

interface IRecordBeanInstance {
  beanInstanceKey: string;
  withSelector?: boolean;
  args: any[];
}

interface IRecordBeanInstanceProp {
  beanInstance: any;
  prop: string;
}

export const SymbolHmrStateSave = Symbol('SymbolHmrStateSave');
export const SymbolHmrStateLoad = Symbol('SymbolHmrStateLoad');

export class AppHmr extends BeanSimple {
  public recordBeanInstances: Record<string, IRecordBeanInstance[] | undefined> = {};
  public recordBeanInstanceProps: Record<string, IRecordBeanInstanceProp[] | undefined> = {};

  addBeanInstance(
    beanFullName: string,
    beanInstanceKey: string,
    args: any[],
    withSelector?: boolean,
  ) {
    if (!this.recordBeanInstances[beanFullName]) {
      this.recordBeanInstances[beanFullName] = [];
    }
    this.recordBeanInstances[beanFullName].push({
      beanInstanceKey,
      withSelector,
      args,
    });
  }

  addBeanInstanceProp(beanInstance: any, prop: string, targetBeanFullName: string) {
    if (!this.recordBeanInstanceProps[targetBeanFullName]) {
      this.recordBeanInstanceProps[targetBeanFullName] = [];
    }
    this.recordBeanInstanceProps[targetBeanFullName].push({
      beanInstance,
      prop,
    });
  }

  mutateBeanInstance(beanFullName: string, beanInstanceKey: string, args: any[]) {
    const beanInstances = this.recordBeanInstances[beanFullName];
    if (!beanInstances) return;
    const beanInstance = beanInstances.find(item => item.beanInstanceKey === beanInstanceKey);
    if (!beanInstance) return;
    beanInstance.args = args;
  }
}
