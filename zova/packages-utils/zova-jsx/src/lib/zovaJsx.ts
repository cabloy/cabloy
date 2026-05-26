import type { VNode } from 'vue';

import { compose } from '@cabloy/compose';
import {
  celEnvBase,
  evaluateExpressions,
  getProperty,
  isEmptyObject,
  isNil,
  isPromise,
} from '@cabloy/utils';
import { toUpperCaseFirstChar } from '@cabloy/word-utils';
import { createTextVNode, h } from 'vue';
import { BeanControllerIdentifier, BeanSimple, cast, objectAssignReactive } from 'zova-core';

import type {
  TypeRenderComponent,
  TypeRenderComponentJsx,
  TypeRenderComponentJsxProps,
} from '../types/rest.ts';

import { renderFieldJsxPropsSystem } from './const.ts';
import {
  isJsxComponent,
  isJsxEvent,
  isNativeElement,
  isZovaComponent,
  normalizePropName,
} from './utils.ts';

type CelEnv = typeof celEnvBase;

export class ZovaJsx extends BeanSimple {
  private _components: {} | undefined;
  private _celEnv: CelEnv;
  private _transientObject: any;

  constructor(components?: {}, celEnv?: CelEnv) {
    super();
    this._components = components;
    this._celEnv = this._prepareCelEnv(celEnv ?? celEnvBase);
  }

  private _prepareCelEnv(celEnv: CelEnv) {
    celEnv = celEnv.clone();
    celEnv.registerFunction('getEvent():dyn', () => {
      return this.transientObject.eventObject ?? null; // null means valid value
    });
    celEnv.registerFunction('getEventProp(string):dyn', prop => {
      return getProperty(this.transientObject.eventObject, prop) ?? null; // null means valid value
    });
    return celEnv;
  }

  public setTransientObject<T>(transientObject: {} | undefined, fnMethod: () => T): T {
    const transientObjectPrev = this._transientObject;
    this._transientObject = transientObject;
    try {
      return fnMethod();
    } finally {
      this._transientObject = transientObjectPrev;
    }
  }

  public get transientObject() {
    return this._transientObject;
  }

  public get event(): Event | undefined {
    return this.transientObject?.eventObject;
  }

  public get components() {
    return this._components;
  }

  public get celEnv(): CelEnv {
    return this._celEnv;
  }

  public evaluateExpression(expression: any, celScope?: {}) {
    return evaluateExpressions(expression, celScope, this.celEnv);
  }

  public renderJsxOrCel(
    componentJsx: TypeRenderComponent | any,
    props: {} | undefined,
    celScope?: {},
    renderContext?: {},
  ) {
    // component
    if (isJsxComponent(componentJsx)) {
      const transientObject = this.transientObject;
      const renderFn = () => {
        return this.setTransientObject(transientObject, () => {
          return this.render(componentJsx, props, celScope, renderContext);
        });
      };
      renderFn['zova-jsx:component'] = componentJsx.type;
      return renderFn;
    }
    if (isJsxEvent(componentJsx)) {
      let transientObject = this.transientObject;
      return (event: Event) => {
        transientObject = { ...transientObject, eventObject: event };
        return this.setTransientObject(transientObject, () => {
          return this.renderEvent(event, componentJsx, celScope, renderContext);
        });
      };
    }
    // normal
    return this.evaluateExpression(componentJsx, celScope);
  }

  public renderEvent(
    event: Event,
    componentJsx: TypeRenderComponentJsx,
    celScope?: {},
    renderContext?: {},
  ) {
    // props
    if (event && event instanceof Event) {
      const props: any = this.renderJsxProps(componentJsx.props, {}, celScope, renderContext);
      if (props.stop) event.stopPropagation();
      if (props.prevent) event.preventDefault();
    }
    // render
    const eventRes: any[] = [];
    celScope = objectAssignReactive({}, celScope, { res: eventRes });
    return this.renderEventDirect(componentJsx, celScope!, renderContext, eventRes);
  }

  public renderEventDirect(
    componentJsx: TypeRenderComponentJsx,
    celScope: {},
    renderContext: {} | undefined,
    eventRes: any[],
    next?: Function,
  ) {
    const actions = this._collectEventActions(componentJsx, celScope, renderContext, eventRes);
    if (!actions || actions.length === 0) return next ? next(undefined) : undefined;
    const transientObject = this.transientObject;
    return compose(actions)(undefined, actionRes => {
      if (!next) return actionRes;
      return this.setTransientObject(transientObject, () => {
        return next(actionRes);
      });
    });
  }

  private _collectEventActions(
    componentJsx: TypeRenderComponentJsx,
    celScope: {},
    renderContext: {} | undefined,
    eventRes: any[],
  ) {
    let actionChildren = componentJsx.props?.children;
    if (!actionChildren) return;
    if (!Array.isArray(actionChildren)) actionChildren = [actionChildren];
    const actions: Function[] = [];
    const transientObject = this.transientObject;
    for (let index = 0; index < actionChildren.length; index++) {
      const actionChild = actionChildren[index];
      // action
      const action = (actionRes: any, next: Function) => {
        if (isPromise(actionRes)) {
          return actionRes.then(actionRes => {
            return this._actionHandler(
              index,
              actionChild,
              actionRes,
              next,
              actionChildren,
              celScope,
              renderContext,
              eventRes,
              transientObject,
            );
          });
        } else {
          return this._actionHandler(
            index,
            actionChild,
            actionRes,
            next,
            actionChildren,
            celScope,
            renderContext,
            eventRes,
            transientObject,
          );
        }
      };
      actions.push(action);
    }
    return actions;
  }

  private _actionHandler(
    index: number,
    actionChild: TypeRenderComponentJsx,
    actionRes: any,
    next: Function,
    actionChildren: TypeRenderComponentJsx[],
    celScope: {},
    renderContext: {} | undefined,
    eventRes: any[],
    transientObject: any,
  ) {
    return this.setTransientObject(transientObject, () => {
      // record res
      if (index > 0) {
        if (actionRes === undefined) actionRes = null;
        eventRes[index - 1] = actionRes;
        const actionChildPrev = actionChildren[index - 1];
        const resName = cast(actionChildPrev.props)?.res;
        if (resName) {
          celScope[resName] = actionRes;
        }
      }
      // vIf
      const vIf = this.evaluateExpression(actionChild.props?.['v-if'], celScope);
      if (vIf === false) return next(undefined);
      // action
      if (actionChild.type === 'ZovaCommands') {
        // nested action
        eventRes[index] = [];
        return this.renderEventDirect(
          actionChild,
          objectAssignReactive({}, celScope),
          renderContext,
          eventRes[index],
          next,
        );
      } else {
        // normal
        return this._renderEventActionNormal(actionChild, celScope, renderContext, next);
      }
    });
  }

  private _renderEventActionNormal(
    actionChild: TypeRenderComponentJsx,
    celScope: {},
    renderContext: {} | undefined,
    next: Function,
  ) {
    // action
    const beanFullName = actionChild.type as any;
    const beanInstance = this.sys.bean._getBeanSyncOnly(beanFullName);
    if (beanInstance) {
      // sync
      return this._renderEventActionNormal_inner(
        beanInstance,
        actionChild,
        celScope,
        renderContext,
        next,
      );
    }
    // async
    const transientObject = this.transientObject;
    return this.sys.bean._getBean(beanFullName, false).then(beanInstance => {
      return this.setTransientObject(transientObject, () => {
        return this._renderEventActionNormal_inner(
          beanInstance,
          actionChild,
          celScope,
          renderContext,
          next,
        );
      });
    });
  }

  private _renderEventActionNormal_inner(
    beanInstance: any,
    actionChild: TypeRenderComponentJsx,
    celScope: {},
    renderContext: {} | undefined,
    next: Function,
  ) {
    const onionOptions = beanInstance.$onionOptions;
    // props
    let props = this.renderJsxProps(cast(actionChild.props).options, {}, celScope, renderContext);
    if (!isEmptyObject(onionOptions)) {
      // not use deepExtend, maybe: Maximum call stack size exceeded
      props = Object.assign({}, onionOptions, props);
    }
    if (!renderContext) throw new Error('should provide renderContext');
    return beanInstance.execute(props, renderContext, next);
  }

  public render(
    componentJsx: TypeRenderComponent,
    propsInit: {} | undefined,
    celScope?: {},
    renderContext?: {},
  ): VNode | VNode[] | undefined {
    if (!componentJsx) {
      throw new Error(`render component should not ${componentJsx}`);
    }
    componentJsx = this.normalizeComponenJsx(componentJsx, propsInit);
    const componentProps = componentJsx.props;
    const props = {}; // new one
    // vIf
    const vIf = this.evaluateExpression(componentProps?.['v-if'], celScope);
    if (vIf === false) return;
    // component
    const Component = this.normalizeComponent(componentJsx.type);
    // vFor
    const vFor = this.evaluateExpression(componentProps?.['v-for'], celScope);
    if (!vFor)
      return this._renderJsxSingle(Component, componentJsx, props, celScope, renderContext);
    const children: VNode[] = [];
    for (let index = 0; index < vFor.length; index++) {
      const each = vFor[index];
      const eachName = this.evaluateExpression(componentJsx.props?.['v-each'], celScope) ?? 'each';
      const celScopeEach = objectAssignReactive({}, celScope, {
        [eachName]: each,
        [`${eachName}Index`]: index,
      });
      const propsEach = { ...props };
      const child = this._renderJsxSingle(
        Component,
        componentJsx,
        propsEach,
        celScopeEach,
        renderContext,
      );
      if (child) {
        children.push(child);
      }
    }
    return children;
  }

  public normalizeComponenJsx(
    componentJsx: TypeRenderComponent,
    propsInit?: {},
  ): TypeRenderComponentJsx {
    if (typeof componentJsx === 'object') {
      return Object.assign({}, componentJsx, {
        key: cast(propsInit)?.key ?? componentJsx.key,
        props: Object.assign({}, componentJsx.props, propsInit),
      });
    }
    return { type: componentJsx as any, props: propsInit as any };
  }

  public normalizeComponent(type: TypeRenderComponent) {
    if (typeof type === 'function') return type;
    // if type is native element, for example: 'div/input'
    if (typeof type === 'string' && !isNativeElement(type)) {
      type = this.components?.[type] ?? type;
    }
    if (typeof type === 'string' && ['script', 'style', 'link'].includes(type)) {
      throw new Error(`not valid zova jsx component: ${type}`);
    }
    // div/QInput/Zova Component
    return type;
  }

  private _renderJsxSingle(
    Component: any,
    componentJsx: TypeRenderComponentJsx,
    props: {},
    celScope?: {},
    renderContext?: {},
  ): VNode {
    const _isZovaComponent = isZovaComponent(Component);
    // key
    if (!isNil(componentJsx.key)) {
      cast(props).key = this.evaluateExpression(componentJsx.key, celScope);
    }
    // props
    this.renderJsxProps(componentJsx.props, props, celScope, renderContext);
    // style
    if (cast(props).class || cast(props).style) {
      const controller = this.ctx.bean._getBeanSyncOnly(BeanControllerIdentifier) as any;
      cast(props).class = controller.$cssMerge(
        cast(props).class,
        controller.$style(cast(props).style),
      );
      delete cast(props).style;
    }
    // children
    let children;
    const propsChildren = componentJsx.props?.children;
    if (!propsChildren) {
      children = undefined;
    } else {
      if (isNativeElement(Component)) {
        children = this.renderJsxChildrenDirect(
          componentJsx.props!.children,
          celScope,
          renderContext,
        );
      } else {
        const childrenCollect = this._renderJsxChildrenCollect(
          componentJsx.props!.children,
          celScope,
          renderContext,
        );
        if (_isZovaComponent) {
          for (const key in childrenCollect) {
            const slot = childrenCollect[key];
            if (key === 'default') {
              children = slot;
            } else {
              props[`slot${toUpperCaseFirstChar(key)}`] = slot;
            }
          }
        } else {
          children = childrenCollect;
        }
      }
    }
    if (_isZovaComponent) {
      Component = this.sys.meta.component.getZovaComponent(Component as never);
    }
    const vnode = h(Component, props, children);
    if (_isZovaComponent && renderContext) {
      cast(vnode).zovaHostProviders = { $$renderContext: renderContext };
    }
    return vnode;
  }

  public renderJsxProps(
    jsxProps: TypeRenderComponentJsxProps | undefined,
    props: {},
    celScope?: {},
    renderContext?: {},
  ) {
    if (!jsxProps) return props;
    const keys = Object.keys(jsxProps).filter(item => !renderFieldJsxPropsSystem.includes(item));
    if (keys.length === 0) return props;
    for (const key of keys) {
      const keyValue = this.renderJsxOrCel(jsxProps[key], undefined, celScope, renderContext);
      const propName = normalizePropName(key);
      props[propName] = keyValue;
    }
    return props;
  }

  private _renderJsxChildrenCollect(
    jsxChildren: TypeRenderComponentJsx | TypeRenderComponentJsx[],
    celScope?: {},
    renderContext?: {},
  ) {
    if (!Array.isArray(jsxChildren)) jsxChildren = [jsxChildren];
    const children: TypeRenderComponentJsx[] = [];
    const slots: Record<string, TypeRenderComponentJsx> = {};
    const transientObject = this.transientObject;
    for (const jsxChild of jsxChildren) {
      if (jsxChild && typeof jsxChild === 'object' && jsxChild.props?.['v-slot']) {
        const slotName = jsxChild.props?.['v-slot'];
        const slotScopeName = jsxChild.props?.['v-slot-scope'];
        let slot;
        if (slotScopeName) {
          slot = slotScope => {
            return this.setTransientObject(transientObject, () => {
              const celScopeSub = objectAssignReactive({}, celScope, {
                [slotScopeName]: slotScope,
              });
              return this.renderJsxChildrenDirect(jsxChild, celScopeSub, renderContext);
            });
          };
        } else {
          slot = () => {
            return this.setTransientObject(transientObject, () => {
              return this.renderJsxChildrenDirect(jsxChild, celScope, renderContext);
            });
          };
        }
        slots[slotName] = slot;
      } else {
        children.push(jsxChild);
      }
    }
    // slotDefault
    const slotDefault =
      children.length === 0
        ? undefined
        : () => {
            return this.setTransientObject(transientObject, () => {
              return this.renderJsxChildrenDirect(children, celScope, renderContext);
            });
          };
    // ok
    return {
      ...slots,
      default: slotDefault,
    };
  }

  public renderJsxChildrenDirect(
    jsxChildren: TypeRenderComponentJsx | TypeRenderComponentJsx[],
    celScope?: {},
    renderContext?: {},
  ) {
    if (!Array.isArray(jsxChildren)) jsxChildren = [jsxChildren];
    const children: VNode[] = [];
    for (let index = 0; index < jsxChildren.length; index++) {
      const jsxChild = jsxChildren[index];
      let child;
      if (isJsxComponent(jsxChild)) {
        if (jsxChild.type === 'var') {
          const props = this.renderJsxProps(jsxChild.props, {}, celScope, renderContext);
          celScope![cast(props).name] = cast(props).value;
          child = undefined;
        } else if (jsxChild.type === 'log') {
          if (process.env.CLIENT) {
            const props = this.renderJsxProps(jsxChild.props, {}, celScope, renderContext);
            const name = cast(props).name;
            const message = cast(props).message;
            if (isNil(name)) {
              console.log(message);
            } else {
              console.log(name, message);
            }
          }
          child = undefined;
        } else {
          const propsInit = { key: jsxChild.key ?? index };
          child = this.render(jsxChild, propsInit, celScope, renderContext);
        }
      } else {
        const childText = this.evaluateExpression(jsxChild, celScope);
        child = createTextVNode(childText ?? '');
      }
      if (child) {
        if (Array.isArray(child)) {
          children.push(...child);
        } else {
          children.push(child);
        }
      }
    }
    return children;
  }
}
