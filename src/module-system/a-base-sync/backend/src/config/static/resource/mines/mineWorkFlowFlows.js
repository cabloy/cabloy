module.exports = app => {
  // actionPath
  const actionPath = '/a/flowtask/flow/tabs';
  // resource
  const resource = {
    atomName: 'Flows',
    atomStaticKey: 'mineWorkFlowFlows',
    atomRevision: 2,
    atomCategoryId: 'a-base:mine.WorkFlow',
    resourceType: 'a-base:mine',
    resourceConfig: JSON.stringify({
      actionPath,
      stats: {
        params: {
          module: 'a-flow',
          name: 'flowInitiateds',
        },
        color: 'orange',
      },
    }),
    resourceIcon: '::flow-chart',
    appKey: 'a-app:appDefault',
    resourceRoles: 'root',
    resourceSorting: 2,
  };
  return resource;
};
