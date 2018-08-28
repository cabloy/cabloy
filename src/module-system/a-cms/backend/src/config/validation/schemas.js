module.exports = app => {
  const schemas = {};
  // article
  schemas.article = {
    type: 'object',
    properties: {
      atomName: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'What to write',
        notEmpty: true,
      },
      language: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Language',
        notEmpty: true,
      },
      editMode: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Edit Mode',
        notEmpty: true,
      },
      content: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Language',
        notEmpty: true,
      },
    },
  };
  // todo search
  schemas.todoSearch = {
    type: 'object',
    properties: {

    },
  };
  return schemas;
};
