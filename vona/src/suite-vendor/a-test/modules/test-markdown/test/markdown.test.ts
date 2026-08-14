import assert from 'node:assert';
import { describe, it } from 'node:test';
import { app } from 'vona-mock';

describe('markdown.test.ts', () => {
  it('renders supported Markdown structures', async () => {
    await app.bean.executor.mockCtx(async () => {
      const html = app.bean.markdown.renderHtml(`
# Product details

A **durable** product with [documentation](https://example.com/docs).

| Feature | Value |
| --- | --- |
| Material | Steel |

\`\`\`ts
const sku = 'SKU-1';
\`\`\`

![Product image](https://example.com/product.png "Product")
`);

      assert.match(html, /<h1>Product details<\/h1>/);
      assert.match(html, /<strong>durable<\/strong>/);
      assert.match(
        html,
        /<a target="_blank" rel="noopener noreferrer" href="https:\/\/example\.com\/docs">documentation<\/a>/,
      );
      assert.match(html, /<table>/);
      assert.match(html, /<code class="language-ts">/);
      assert.match(
        html,
        /<img src="https:\/\/example\.com\/product\.png" alt="Product image" title="Product" \/?>/,
      );
    });
  });

  it('preserves disabled task-list checkboxes and their checked state', async () => {
    await app.bean.executor.mockCtx(async () => {
      const html = app.bean.markdown.renderHtml(`
- [ ] Open task
- [x] Completed task
  - [ ] Nested task
`);

      assert.match(html, /<ul data-type="taskList">/);
      assert.match(html, /<li data-type="taskItem" data-checked="false">/);
      assert.match(html, /<li data-type="taskItem" data-checked="true">/);
      assert.match(
        html,
        /<label><input type="checkbox" disabled="disabled" \/><span><\/span><\/label>/,
      );
      assert.match(html, /<input type="checkbox" checked="checked" disabled="disabled" \/>/);
      assert.match(html, /<div><p>Open task<\/p><\/div>/);
      assert.doesNotMatch(html, /<input(?![^>]*type="checkbox")/);
      assert.doesNotMatch(html, /<input[^>]+(?:on\w+|style|value|name|id|form)=/i);
    });
  });

  it('strips unsafe HTML and URLs from rendered output', async () => {
    await app.bean.executor.mockCtx(async () => {
      const html = app.bean.markdown.renderHtml(`
<script>alert('script')</script>
<iframe src="https://attacker.example"></iframe>
<img src="javascript:alert('image')" onerror="alert('event')" style="color:red">
<a href="javascript:alert('link')" onclick="alert('event')">unsafe link</a>
<a href="https://example.com" style="color:red">safe link</a>
`);

      assert.doesNotMatch(html, /<script/i);
      assert.doesNotMatch(html, /<iframe/i);
      assert.doesNotMatch(html, /<img[^>]+onerror|<a[^>]+onclick|<a[^>]+style=/i);
      assert.doesNotMatch(html, /<a[^>]+javascript:/i);
      assert.match(
        html,
        /&lt;img src="javascript:alert\('image'\)" onerror="alert\('event'\)" style="color:red"&gt;/,
      );
      assert.match(html, /&lt;a href="javascript:alert\('link'\)" onclick="alert\('event'\)"&gt;/);
      assert.match(
        html,
        /&lt;a href="https:\/\/example\.com" style="color:red"&gt;safe link&lt;\/a&gt;/,
      );
    });
  });

  it('returns an empty string for empty Markdown', async () => {
    await app.bean.executor.mockCtx(async () => {
      assert.equal(app.bean.markdown.renderHtml(), '');
      assert.equal(app.bean.markdown.renderHtml('   \n\t'), '');
    });
  });
});
