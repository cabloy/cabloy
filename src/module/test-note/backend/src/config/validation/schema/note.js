module.exports = app => {
  const schemas = {};
  // note
  schemas.note = {
    type: 'object',
    properties: {
      atomName: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Title',
        notEmpty: true,
      },
      content: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Content',
        ebTextarea: true,
      },
    },
  };
  // note search
  schemas.noteSearch = {
    type: 'object',
    properties: {
      description: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Description',
      },
    },
  };
  return schemas;
};
