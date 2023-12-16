// const moduleInfo = module.info;
module.exports = app => {
  const schemas = {};
  // layout
  schemas.layout = {
    type: 'object',
    properties: {
      atomName: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Name',
        notEmpty: true,
      },
      atomStaticKey: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'KeyForAtom',
        ebReadOnly: true,
        notEmpty: true,
      },
      description: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Description',
      },
      layoutTypeCode: {
        type: 'number',
        ebType: 'dict',
        ebTitle: 'Layout Type',
        ebOptionsBlankAuto: true,
        ebParams: {
          dictKey: 'a-dictbooster:dictLayoutType',
        },
        notEmpty: {
          ignoreZero: true,
        },
      },
      content: {
        type: 'string',
        ebType: 'json',
        ebTitle: 'Content',
        notEmpty: true,
      },
    },
  };
  // layout search
  schemas.layoutSearch = {
    type: 'object',
    properties: {
      layoutTypeCode: {
        type: 'number',
        ebType: 'dict',
        ebTitle: 'Layout Type',
        ebParams: {
          dictKey: 'a-dictbooster:dictLayoutType',
        },
        ebOptionsBlankAuto: true,
      },
    },
  };
  return schemas;
};
