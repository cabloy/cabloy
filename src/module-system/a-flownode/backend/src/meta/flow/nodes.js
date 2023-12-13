const defaults = require('./defaults.js');

module.exports = app => {
  const moduleInfo = module.info;
  const nodes = {
    // events
    startEventNone: {
      title: 'StartEventNone',
      group: 'startEvent',
      bean: 'startEventNone',
      icon: { f7: ':flow:start-event-none' },
    },
    startEventTimer: {
      title: 'StartEventTimer',
      group: 'startEvent',
      bean: 'startEventTimer',
      icon: { f7: ':flow:start-event-timer' },
      validator: {
        module: moduleInfo.relativeName,
        validator: 'startEventTimer',
      },
    },
    endEventNone: {
      title: 'EndEventNone',
      group: 'endEvent',
      bean: 'endEventNone',
      icon: { f7: ':flow:end-event-none' },
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
      icon: { f7: ':flow:activity-service' },
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
