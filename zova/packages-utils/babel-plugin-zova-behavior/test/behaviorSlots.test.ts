import { transformSync, traverse, types as t } from '@babel/core';
import vueJsx from '@vue/babel-plugin-jsx';
import { renderToString } from '@vue/server-renderer';
import assert from 'node:assert/strict';
import test from 'node:test';
import { createVNode, Fragment } from 'vue';

import behavior from '../src/index.ts';

function transform(source: string) {
  const result = transformSync(source, {
    filename: 'fixture.tsx',
    configFile: false,
    babelrc: false,
    ast: true,
    plugins: [behavior, vueJsx],
  });
  assert.ok(result?.ast);
  return result.ast;
}

function getBehaviorVNodeChildren(ast: t.File) {
  let children: t.Expression | null | undefined;
  traverse(ast, {
    CallExpression(path) {
      if (!t.isIdentifier(path.node.callee, { name: '_createVNode' })) return;
      const [tag, , vnodeChildren] = path.node.arguments;
      if (!t.isCallExpression(tag)) return;
      if (!t.isIdentifier(tag.callee, { name: '_resolveComponent' })) return;
      if (!t.isStringLiteral(tag.arguments[0], { value: 'ZBehavior__' })) return;
      children = vnodeChildren as t.Expression | null | undefined;
      path.stop();
    },
  });
  assert.notEqual(children, undefined, 'should render ZBehavior__');
  return children;
}

function getDefaultSlot(children: t.Expression | null | undefined) {
  assert.ok(t.isObjectExpression(children), 'ZBehavior__ children should be a slot object');
  const defaultSlot = children.properties.find(
    property =>
      t.isObjectProperty(property) &&
      t.isIdentifier(property.key, { name: 'default' }) &&
      t.isArrowFunctionExpression(property.value),
  );
  assert.ok(defaultSlot && t.isObjectProperty(defaultSlot));
  assert.ok(t.isArrowFunctionExpression(defaultSlot.value));
  return defaultSlot.value;
}

function getSlotFragmentChildren(defaultSlot: t.ArrowFunctionExpression) {
  assert.ok(t.isArrayExpression(defaultSlot.body));
  assert.equal(defaultSlot.body.elements.length, 1);
  const [fragment] = defaultSlot.body.elements;
  assert.ok(t.isCallExpression(fragment));
  const children = fragment.arguments[2];
  assert.ok(t.isArrayExpression(children));
  return children.elements;
}

test('native behavior target wraps a dynamic child in a default slot', () => {
  const ast = transform(
    'const dom = <button bs-basic-button-perform={options}>{this.$slotDefault?.()}</button>;',
  );
  const defaultSlot = getDefaultSlot(getBehaviorVNodeChildren(ast));
  const children = getSlotFragmentChildren(defaultSlot);
  assert.equal(children.length, 1);
  assert.ok(t.isOptionalCallExpression(children[0]));
});

test('native behavior target wraps static children in a default slot', () => {
  const ast = transform('const dom = <button bs-basic-button-perform={options}>Delete</button>;');
  const defaultSlot = getDefaultSlot(getBehaviorVNodeChildren(ast));
  assert.equal(getSlotFragmentChildren(defaultSlot).length, 1);
});

test('native behavior target preserves an explicit default slot function', () => {
  const ast = transform(
    'const dom = <button bs-basic-button-perform={options}>{() => this.$slotDefault?.()}</button>;',
  );
  const defaultSlot = getDefaultSlot(getBehaviorVNodeChildren(ast));
  assert.ok(t.isOptionalCallExpression(defaultSlot.body));
});

test('native behavior target without children does not create a default slot', () => {
  const ast = transform('const dom = <button bs-basic-button-perform={options} />;');
  assert.ok(t.isNullLiteral(getBehaviorVNodeChildren(ast)));
});

test('component behavior target keeps dynamic children as a default slot', () => {
  const ast = transform(
    'const dom = <VBtn bs-start-button-perform={options}>{this.$slotDefault?.()}</VBtn>;',
  );
  const defaultSlot = getDefaultSlot(getBehaviorVNodeChildren(ast));
  assert.ok(t.isArrayExpression(defaultSlot.body));
  assert.equal(defaultSlot.body.elements.length, 1);
  assert.ok(t.isOptionalCallExpression(defaultSlot.body.elements[0]));
});

test('native targets render a default slot that returns an array', async () => {
  const fragment = createVNode(Fragment, null, ['Delete']);
  const html = await renderToString(createVNode('button', null, { default: () => [fragment] }));
  assert.match(html, /Delete/);
});

test('native targets do not render a default slot that returns a bare Fragment', async () => {
  const fragment = createVNode(Fragment, null, ['Delete']);
  const html = await renderToString(createVNode('button', null, { default: () => fragment }));
  assert.doesNotMatch(html, /Delete/);
});
