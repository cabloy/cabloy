module.exports = app => {
  // actionPath
  const options = {
    mode: 'completeds',
  };
  const actionPath = `/a/flowtask/flowTask/list?options=${encodeURIComponent(JSON.stringify(options))}`;
  // resource
  const resource = {
    atomName: 'Completeds',
    atomStaticKey: 'mineTaskCompleteds',
    atomRevision: 0,
    atomCategoryId: 'a-base:mine.Task',
    resourceType: 'a-base:mine',
    resourceConfig: JSON.stringify({
      actionPath,
    }),
    resourceRoles: 'root',
    resourceSorting: 3,
  };
  return resource;
};
