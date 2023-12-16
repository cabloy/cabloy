// const moduleInfo = module.info;
module.exports = app => {
  const content = {
    info: {
      layout: {
        viewSize: {
          small: 'list',
          medium: 'list',
          large: 'list',
        },
      },
    },
    layouts: {
      base: {
        blocks: {
          subnavbar: false,
        },
      },
      list: {
        options: {
          dataProvider: {
            providerName: 'all',
            autoInit: true,
          },
        },
      },
    },
  };
  const layout = {
    atomName: 'Base',
    atomStaticKey: 'layoutMessageGroupBase',
    atomRevision: 2,
    description: '',
    layoutTypeCode: 7,
    content: JSON.stringify(content),
    resourceRoles: 'root',
  };
  return layout;
};
