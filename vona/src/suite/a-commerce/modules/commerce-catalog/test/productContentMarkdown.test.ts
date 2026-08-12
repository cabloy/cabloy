import assert from 'node:assert';
import { describe, it } from 'node:test';

import { renderProductContentMarkdown } from '../src/lib/productContentMarkdown.ts';

describe('productContentMarkdown.test.ts', () => {
  it('renders supported Markdown structures', () => {
    const html = renderProductContentMarkdown(`
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

  it('strips unsafe HTML and URLs from rendered output', () => {
    const html = renderProductContentMarkdown(`
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

  it('returns an empty string for empty Markdown', () => {
    assert.equal(renderProductContentMarkdown(), '');
    assert.equal(renderProductContentMarkdown('   \n\t'), '');
  });
});
