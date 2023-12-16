
  const schemas = {};
  // <%=argv.atomClassName%>
  schemas.<%=argv.atomClassName%> = {
    type: 'object',
    properties: {
      name: {
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
   module.exports = schemas;
