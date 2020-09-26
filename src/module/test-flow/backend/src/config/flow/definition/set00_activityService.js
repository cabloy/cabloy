const require3 = require('require3');
const assert = require3('assert');

class Listener {
  constructor(context) {
    this.context = context;
  }

  async onNodeBegin(contextNode) {
    if (contextNode._nodeRef.id === 'activity_1') {
      this.context.vars.set('echo', 'hello');
    }
  }

  async onNodeDoing(contextNode) {
    if (contextNode._nodeRef.id === 'activity_2') {
      // execute activity service
      const res = await contextNode.utils.executeService({
        bean: {
          module: 'test-flow',
          name: 'test',
        },
        parameter: 'hello world',
      });
      assert.equal(res, 'hello world');
    }
  }

  async onNodeEnd(contextNode) {
    if (contextNode._nodeRef.id === 'activity_1') {
      const echo = contextNode.vars.get('echo');
      assert.equal(echo, 'hello');
    }
  }

}

module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const definition = {
    info: {
      title: 'Test_Set00_Activity_Service',
      description: 'Test_Set00_Activity_Service',
      version: '2020-09-26 00:00:13',
    },
    listener: Listener.toString(),
    process: {
      nodes: [
        {
          id: 'startEvent_1',
          name: 'Start',
          type: 'startEventNone',
        },
        {
          id: 'activity_1',
          name: 'ActivityService',
          type: 'activityService',
          options: {
            bean: {
              module: moduleInfo.relativeName,
              name: 'test',
            },
            parameterExpression: 'context.vars.get(\`echo\`)',
          },
        },
        {
          id: 'activity_2',
          name: 'ActivityNone',
          type: 'activityNone',
        },
        {
          id: 'endEvent_1',
          name: 'End',
          type: 'endEventNone',
        },
      ],
      edges: [
        {
          id: 'edge_1',
          source: 'startEvent_1',
          target: 'activity_1',
        },
        {
          id: 'edge_2',
          source: 'activity_1',
          target: 'activity_2',
        },
        {
          id: 'edge_3',
          source: 'activity_2',
          target: 'endEvent_1',
        },
      ],
    },
  };
  return definition;
};
