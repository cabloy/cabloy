module.exports = app => {
  // actionPath
  const options = {
    mode: 'claimings',
  };
  const actionPath = `/a/flowtask/flowTask/list?options=${encodeURIComponent(JSON.stringify(options))}`;
  // resource
  const resource = {
    atomName: 'Claimings',
    atomStaticKey: 'mineTaskClaimings',
    atomRevision: -1,
    atomCategoryId: 'a-base:mine.Task',
    resourceType: 'a-base:mine',
    resourceConfig: JSON.stringify({
      actionPath,
      stats: {
        params: {
          module: 'a-flowtask',
          name: 'taskClaimings',
        },
        color: 'red',
      },
    }),
    resourceRoles: 'root',
    resourceSorting: 1,
  };
  return resource;
};
