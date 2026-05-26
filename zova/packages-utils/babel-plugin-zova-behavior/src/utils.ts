import type { /* template, */ NodePath } from '@babel/core';
import type { PluginPass } from '@babel/core';

import { types as t } from '@babel/core';
import htmlTags from 'html-tags';
import svgTags from 'svg-tags';

export const FRAGMENT = 'Fragment';
export const KEEP_ALIVE = 'KeepAlive';

export const shouldTransformedToSlots = (tag: string) =>
  !(tag.match(new RegExp(`^_?${FRAGMENT}\\d*$`)) || tag === KEEP_ALIVE);

export const transformJSXMemberExpression = (
  path: NodePath<t.JSXMemberExpression>,
): t.MemberExpression => {
  const objectPath = path.node.object;
  const propertyPath = path.node.property;
  const transformedObject = t.isJSXMemberExpression(objectPath)
    ? transformJSXMemberExpression(path.get('object') as NodePath<t.JSXMemberExpression>)
    : t.isJSXIdentifier(objectPath)
      ? t.identifier(objectPath.name)
      : t.nullLiteral();
  const transformedProperty = t.identifier(propertyPath.name);
  return t.memberExpression(transformedObject, transformedProperty);
};

export const checkIsComponent = (
  path: NodePath<t.JSXOpeningElement>,
  state: PluginPass,
): boolean => {
  const namePath = path.get('name');

  if (namePath.isJSXMemberExpression()) {
    return shouldTransformedToSlots(namePath.node.property.name); // For withCtx
  }

  const tag = (namePath as NodePath<t.JSXIdentifier>).node.name;

  return (
    !(state.opts as any).isCustomElement?.(tag) &&
    shouldTransformedToSlots(tag) &&
    !htmlTags.includes(tag as htmlTags.htmlTags) &&
    !svgTags.includes(tag)
  );
};

/**
 * Get tag (first attribute for h) from JSXOpeningElement
 * @param path JSXElement
 * @param state State
 * @returns Identifier | StringLiteral | MemberExpression | CallExpression
 */
export const getTag = (
  path: NodePath<t.JSXElement>,
  state: PluginPass,
): t.Identifier | t.CallExpression | t.StringLiteral | t.MemberExpression => {
  const namePath = path.get('openingElement').get('name');
  if (namePath.isJSXIdentifier()) {
    const { name } = namePath.node;
    if (!htmlTags.includes(name as htmlTags.htmlTags) && !svgTags.includes(name)) {
      return name === FRAGMENT
        ? t.identifier(FRAGMENT)
        : path.scope.hasBinding(name)
          ? t.identifier(name)
          : (state.opts as any).isCustomElement?.(name)
            ? t.stringLiteral(name)
            : t.callExpression(t.identifier('resolveComponent'), [t.stringLiteral(name)]);
    }

    return t.stringLiteral(name);
  }

  if (namePath.isJSXMemberExpression()) {
    return transformJSXMemberExpression(namePath);
  }
  throw new Error(`getTag: ${namePath.type} is not supported`);
};
