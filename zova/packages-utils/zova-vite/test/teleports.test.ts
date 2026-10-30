import { createSSRApp, h, Teleport } from '@cabloy/vue-runtime-dom';
import { renderToString } from '@cabloy/vue-server-renderer';
import assert from 'node:assert/strict';
import { test } from 'node:test';

import { collectTeleports, renderTeleports } from '../src/teleports.ts';

const anchors = '<!--teleport start anchor--><!--teleport anchor-->';

async function renderTeleport(to: string, disabled: boolean) {
  const context: { teleports?: Record<string, string> } = {};
  const app = createSSRApp({
    render: () => h('main', [h(Teleport, { to, disabled }, h('span', 'action'))]),
  });
  const html = await renderToString(app, context);
  assert.ok(context.teleports);
  return { html, teleports: context.teleports };
}

function assertUnsupportedTarget(target: string, fragment = '') {
  assert.throws(
    () => renderTeleports({ [target]: fragment }),
    error => {
      assert.ok(error instanceof Error);
      assert.ok(error.message.includes(JSON.stringify(target)));
      assert.match(error.message, /simple #id/);
      assert.match(error.message, /dedicated.*container/i);
      return true;
    },
  );
}

test('empty Teleport maps produce no containers', () => {
  assert.equal(renderTeleports(undefined), '');
  assert.equal(renderTeleports(null), '');
  assert.equal(renderTeleports({}), '');
});

test('simple ID targets retain empty fragments, anchors, and entry order', () => {
  const teleports = {
    '#modal-root': '<p>first &amp; second</p>',
    '#v-0': anchors,
    '#v-0-0': '',
    '#_overlay2': '<span>last</span>',
  };
  assert.equal(
    renderTeleports(teleports),
    '<div id="modal-root"><p>first &amp; second</p></div>' +
      `<div id="v-0">${anchors}</div>` +
      '<div id="v-0-0"></div><div id="_overlay2"><span>last</span></div>',
  );
});

test('unsupported selectors and unsafe IDs fail even with empty fragments', () => {
  const targets = [
    'body',
    'head',
    'html',
    '.modal',
    '[data-modal]',
    '',
    '#',
    '#1modal',
    '#modal .child',
    '#modal>span',
    '#modal,#other',
    '#modal.active',
    '#modal:focus',
    '#modal[open]',
    '#modal\\:child',
    '#modal" data-other="value',
    "#modal'",
    '#modal><span>',
    '#modal&amp;',
    ' #modal',
    '#modal ',
    '#modal\n',
    '#modal\r\n',
    `#modal${String.fromCharCode(0x2028)}`,
  ];
  for (const target of targets) assertUnsupportedTarget(target);
  assertUnsupportedTarget('body', anchors);
});

test('collectTeleports inserts supported fragments and propagates unsupported targets', () => {
  const html = '<body>\n  <!--app-teleports-->\n</body>';
  assert.equal(
    collectTeleports(html, { '#modal-root': anchors }),
    `<body><div id="modal-root">${anchors}</div>\n</body>`,
  );
  assert.throws(() => collectTeleports(html, { body: anchors }), /simple #id/);
});

test('real SSR enabled and disabled Teleports preserve their complete target fragments', async () => {
  for (const disabled of [false, true]) {
    const { html, teleports } = await renderTeleport('#modal-root', disabled);
    assert.equal(
      teleports['#modal-root'],
      `<!--teleport start anchor-->${disabled ? '' : '<span>action</span>'}<!--teleport anchor-->`,
    );
    assert.equal(html.includes('<span>action</span>'), disabled);
    assert.equal(
      renderTeleports(teleports),
      `<div id="modal-root">${teleports['#modal-root']}</div>`,
    );
  }
});

test('real SSR disabled body Teleport is rejected instead of becoming an unrelated ID', async () => {
  const { html, teleports } = await renderTeleport('body', true);
  assert.ok(html.includes('<span>action</span>'));
  assert.equal(teleports.body, anchors);
  assert.throws(() => renderTeleports(teleports), /Unsupported SSR Teleport target "body"/);
});
