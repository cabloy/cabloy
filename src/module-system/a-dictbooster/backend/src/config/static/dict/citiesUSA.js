module.exports = app => {
  const dictItems = [
    {
      code: 1,
      name: 'birthday',
      title: 'Birthday',
      options: {
        emoji: '🎂',
      },
    },
    {
      code: 2,
      name: 'dance',
      title: 'Dance',
      options: {
        emoji: '💃',
      },
    },
    {
      code: 3,
      name: 'garden',
      title: 'Garden',
      options: {
        emoji: '🏡',
      },
    },
  ];
  const dictLocales = {};
  const definition = {
    atomName: 'Cities USA',
    atomStaticKey: 'citiesUSA',
    atomRevision: 0,
    description: '',
    dictItems: JSON.stringify(dictItems),
    dictLocales: JSON.stringify(dictLocales),
    resourceRoles: 'root',
  };
  return definition;
};
