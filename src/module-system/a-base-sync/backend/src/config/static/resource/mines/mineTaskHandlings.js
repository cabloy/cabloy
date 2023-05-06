module.exports = app => {
  // actionPath
  const options = {
    mode: 'handlings',
  };
  const actionPath = `/a/flowtask/flowTask/list?options=${encodeURIComponent(JSON.stringify(options))}`;
  // resource
  const resource = {
    atomName: 'Handlings',
    atomStaticKey: 'mineTaskHandlings',
    atomRevision: -1,
    atomCategoryId: 'a-base:mine.Task',
    resourceType: 'a-base:mine',
    resourceConfig: JSON.stringify({
      actionPath,
      stats: {
        params: {
          module: 'a-flowtask',
          name: 'taskHandlings',
        },
        color: 'red',
      },
    }),
    resourceRoles: 'root',
    resourceSorting: 2,
  };
  return resource;
};
