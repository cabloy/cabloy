const moduleInfo = module.info;

const workflow = {
  info: {
    title: 'WorkFlows',
    persistence: true,
    uniform: {
      stats: {
        params: {
          module: 'a-message',
          name: 'message',
          nameSub: `${moduleInfo.relativeName}_workflow`,
        },
        color: 'red',
      },
    },
  },
};
module.exports = workflow;
