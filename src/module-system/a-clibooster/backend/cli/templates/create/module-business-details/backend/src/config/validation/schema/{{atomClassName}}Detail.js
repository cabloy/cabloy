module.exports = app => {
  const schemas = {};
  // detail
  schemas.<%=argv.atomClassName%>Detail = {
    type: 'object',
    properties: {
      detailName: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Name',
        notEmpty: true,
      },
      description: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Description',
      },
    },
  };
  return schemas;
};
