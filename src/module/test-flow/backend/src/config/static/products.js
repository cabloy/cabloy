module.exports = app => {
  // const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const products = [
    // Apple
    {
      atomName: 'Apple',
      atomStaticKey: 'apple',
      atomRevision: 0,
      productCode: 'test-001',
      productPrice: 1200,
    },
    // Pear
    {
      atomName: 'Pear',
      atomStaticKey: 'pear',
      atomRevision: 0,
      productCode: 'test-002',
      productPrice: 1000,
    },
    // Banana
    {
      atomName: 'Banana',
      atomStaticKey: 'banana',
      atomRevision: 0,
      productCode: 'test-003',
      productPrice: 1300,
    },
  ];
  return products;
};
