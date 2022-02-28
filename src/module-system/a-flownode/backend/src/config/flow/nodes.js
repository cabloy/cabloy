const defaults = require('./defaults.js');

module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const nodes = {
    // events
    startEventNone: {
      title: 'StartEventNone',
      group: 'startEvent',
      bean: 'startEventNone',
      icon: '/api/static/a/flownode/bpmn/events/start-event-none.svg',
    },
    startEventTimer: {
      title: 'StartEventTimer',
      group: 'startEvent',
      bean: 'startEventTimer',
      icon: '/api/static/a/flownode/bpmn/events/start-event-timer.svg',
      validator: {
        module: moduleInfo.relativeName,
        validator: 'startEventTimer',
      },
    },
    endEventNone: {
      title: 'EndEventNone',
      group: 'endEvent',
      bean: 'endEventNone',
      icon: '/api/static/a/flownode/bpmn/events/end-event-none.svg',
    },
    // activities
    activityNone: {
      title: 'ActivityNone',
      group: 'activity',
      bean: 'activityNone',
      icon: { f7: ':flow:activity-none' },
    },
    activityService: {
      title: 'ActivityService',
      group: 'activity',
      bean: 'activityService',
      icon: { url: '/api/static/a/flownode/bpmn/activities/activity-service.svg' },
      validator: {
        module: moduleInfo.relativeName,
        validator: 'activityService',
      },
    },
  };

  for (const key in nodes) {
    const node = nodes[key];
    node.options = {};
    if (defaults[key]) {
      node.options.default = defaults[key];
    }
  }

  return nodes;
};
