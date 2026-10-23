// Synthetic, read-only business data for the dev/test MCP example; never shared Commerce data.
const categories = [
  { id: 1, name: 'Electronics', description: 'Synthetic electronics', published: true },
  { id: 2, name: 'Books', published: true },
  { id: 3, name: 'Empty', published: true },
  { id: 4, name: 'Unavailable', published: true },
  { id: 5, name: 'Private', published: false },
] as const;
const products = [
  {
    id: 11,
    categoryId: 1,
    title: 'Wireless Headphones',
    description: 'Synthetic wireless audio',
    descriptionHtml: '<p>Synthetic wireless audio</p>',
    published: true,
    active: true,
  },
  { id: 12, categoryId: 1, title: 'Laptop', published: true, active: true },
  { id: 13, categoryId: 2, title: 'TypeScript Handbook', published: true, active: true },
  { id: 14, categoryId: 4, title: 'Sold Out', published: true, active: true },
  { id: 15, categoryId: 5, title: 'Private Category Product', published: true, active: true },
  { id: 16, categoryId: 1, title: 'Draft Product', published: false, active: true },
  { id: 17, categoryId: 1, title: 'Inactive Product', published: true, active: false },
  { id: 18, categoryId: 4, title: 'Inactive SKU Product', published: true, active: true },
] as const;
const skus = [
  {
    id: 101,
    productId: 11,
    code: 'HEADPHONES-BLACK',
    priceCents: 9999,
    available: 8,
    active: true,
  },
  {
    id: 102,
    productId: 11,
    code: 'HEADPHONES-WHITE',
    priceCents: 10999,
    available: 3,
    active: true,
  },
  { id: 103, productId: 11, code: 'HEADPHONES-EMPTY', priceCents: 1, available: 0, active: true },
  {
    id: 104,
    productId: 11,
    code: 'HEADPHONES-INACTIVE',
    priceCents: 1,
    available: 100,
    active: false,
  },
  { id: 105, productId: 12, code: 'LAPTOP', priceCents: 129900, available: 2, active: true },
  { id: 106, productId: 13, code: 'BOOK', priceCents: 3500, available: 10, active: true },
  { id: 107, productId: 14, code: 'SOLD-OUT', priceCents: 100, available: 0, active: true },
  { id: 108, productId: 15, code: 'PRIVATE', priceCents: 100, available: 5, active: true },
  { id: 109, productId: 16, code: 'DRAFT', priceCents: 100, available: 5, active: true },
  { id: 110, productId: 17, code: 'INACTIVE-PRODUCT', priceCents: 100, available: 5, active: true },
  { id: 111, productId: 18, code: 'INACTIVE-SKU', priceCents: 100, available: 5, active: false },
] as const;

export const catalogFixtures = Object.freeze({
  categories: Object.freeze(categories.map(item => Object.freeze(item))),
  products: Object.freeze(products.map(item => Object.freeze(item))),
  skus: Object.freeze(skus.map(item => Object.freeze(item))),
});
