module.exports = app => {
  const schemas = {};
  // startEventAtom
  schemas.startEventAtom = {
    type: 'object',
    properties: {
      atom: {
        type: 'object',
        ebType: 'atomClass',
        ebTitle: 'Atom Class',
        notEmpty: true,
      },
      conditionExpression: {
        type: 'string',
        ebType: 'text',
        ebTitle: 'Condition Expression',
        ebTextarea: true,
      },
      task: {
        type: 'object',
        ebType: 'panel',
        ebTitle: 'User Task Options',
        $ref: 'activityUserTask',
      },
    },
  };
  return schemas;
};
