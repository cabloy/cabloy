const __propsMapper = {
  className: 'class',
};

export function isNativeElement(Component: any) {
  return (
    typeof Component === 'string' &&
    !Component.includes(':') &&
    Component.charAt(0) >= 'a' &&
    Component.charAt(0) <= 'z'
  );
}

export function isZovaComponent(Component: any) {
  return typeof Component === 'string' && Component.includes(':');
}

export function isLegacyComponent(Component: any) {
  return (
    typeof Component === 'string' &&
    !Component.includes(':') &&
    Component.charAt(0) >= 'A' &&
    Component.charAt(0) <= 'Y'
  );
}

export function isJsxComponent(Component: any) {
  return typeof Component === 'object' && Component?.$$typeof === 'zova-jsx:component';
}

export function isJsxEvent(Component: any) {
  return typeof Component === 'object' && Component?.$$typeof === 'zova-jsx:event';
}

export function invokeProp(prop: any) {
  if (typeof prop === 'function') return prop();
  return prop;
}

export function normalizePropName(name: string) {
  return __propsMapper[name] ?? name;
}
