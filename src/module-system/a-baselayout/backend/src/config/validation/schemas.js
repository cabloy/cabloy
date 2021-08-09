module.exports = app => {
  const schemas = {};
  // filterTabBasic
  schemas.filterTabBasic = {
    type: 'object',
    properties: {
      atomName: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Atom Name',
      },
      stage: {
        type: 'string',
        ebType: 'select',
        ebTitle: 'Stage',
        ebParams: { openIn: 'sheet', closeOnSelect: true },
      },
      __divider: {
        ebType: 'divider',
      },
      atomClass: {
        type: 'object',
        ebType: 'atomClass',
        ebTitle: 'Atom Class',
      },
    },
  };
  return schemas;
};
