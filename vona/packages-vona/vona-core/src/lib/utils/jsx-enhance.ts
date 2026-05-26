import React from 'react';

export function jsxEnhance() {
  const createElementOriginal = React.createElement as any;
  React.createElement = function (...args: any[]) {
    const component = createElementOriginal(...args);
    return _translateJsxRender(component);
  } as any;
}

function _checkIfJsxEvent(type: string) {
  return ['ZovaEvent', 'ZovaCommands'].includes(type) || type.includes('.command.');
}

function _translateJsxRender(component: any) {
  if (typeof component !== 'object' || !component.$$typeof) return component;
  const componentNew: any = {};
  const type =
    typeof component.type === 'function' ? component.type(component.props) : component.type;
  componentNew.$$typeof = _checkIfJsxEvent(type) ? 'zova-jsx:event' : 'zova-jsx:component';
  componentNew.type = type;
  componentNew.key = component.key;
  if (
    componentNew.$$typeof === 'zova-jsx:component' &&
    typeof type === 'string' &&
    type.includes(':')
  ) {
    componentNew.props = { ...component.props, ...component.props?.options };
    delete componentNew.props.options;
  } else {
    componentNew.props = { ...component.props };
  }
  const children = componentNew.props.children;
  if (children) {
    if (Array.isArray(children)) {
      componentNew.props.children = children.map(item => _translateJsxRender(item));
    } else if (typeof children === 'object' && !children.toJSON) {
      componentNew.props.children = _translateJsxRender(children);
    }
  }
  return componentNew;
}
