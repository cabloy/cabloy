module.exports = app => {
  const schemas = {};
  // link
  schemas.link = {
    type: 'object',
    properties: {
      href: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Link',
        format: 'uri',
        notEmpty: true,
      },
      title: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Description',
      },
    },
  };
  // table
  schemas.table = {
    type: 'object',
    properties: {
      rowCount: {
        type: 'number',
        ebType: 'text',
        ebTitle: 'RowCount',
        default: 3,
        notEmpty: true,
      },
      columnCount: {
        type: 'number',
        ebType: 'text',
        ebTitle: 'ColumnCount',
        default: 3,
        notEmpty: true,
      },
    },
  };
  return schemas;
};
