const defaults = require('./defaults.js');

const nodes = {
  // events
  startEventAtom: {
    title: 'StartEventAtom',
    group: 'startEvent',
    bean: 'startEventAtom',
    icon: '/api/static/a/flowtask/bpmn/events/start-event-atom.svg',
  },
  // activities
  activityUserTask: {
    title: 'ActivityUserTask',
    group: 'activity',
    bean: 'activityUserTask',
    icon: '/api/static/a/flowtask/bpmn/activities/activity-user-task.svg',
  },
};

for (const key in nodes) {
  const node = nodes[key];
  node.options = {};
  if (defaults[key]) {
    node.options.default = defaults[key];
  }
}

module.exports = nodes;
