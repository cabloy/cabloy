const defaults = require('./defaults.js');

module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const nodes = {
    // events
    startEventAtom: {
      title: 'StartEventAtom',
      group: 'startEvent',
      bean: 'startEventAtom',
      icon: '/api/static/a/flowtask/bpmn/events/start-event-atom.svg',
      validator: {
        module: moduleInfo.relativeName,
        validator: 'startEventAtom',
      },
    },
    endEventAtom: {
      title: 'EndEventAtom',
      group: 'endEvent',
      bean: 'endEventAtom',
      icon: '/api/static/a/flowtask/bpmn/events/end-event-atom.svg',
    },
    // activities
    activityUserTask: {
      title: 'ActivityUserTask',
      group: 'activity',
      bean: 'activityUserTask',
      icon: '/api/static/a/flowtask/bpmn/activities/activity-user-task.svg',
      validator: {
        module: moduleInfo.relativeName,
        validator: 'activityUserTask',
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
