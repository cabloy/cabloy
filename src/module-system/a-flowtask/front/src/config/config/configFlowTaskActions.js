const actions = {
  viewAtom: {
    title: 'View',
    actionModule: 'a-flowtask',
    actionComponent: 'action',
    icon: { material: 'visibility' },
  },
  handleTask: {
    title: 'Handle',
    actionModule: 'a-flowtask',
    actionComponent: 'action',
    icon: { material: 'play_arrow' },
  },
  cancelFlow: {
    title: 'Cancel Flow',
    actionModule: 'a-flowtask',
    actionComponent: 'action',
    icon: { material: 'stop' },
  },
  assigneesConfirmation: {
    title: 'Confirmation',
    actionModule: 'a-flowtask',
    actionComponent: 'action',
    icon: { material: 'group' },
  },
  recall: {
    title: 'Recall',
    actionModule: 'a-flowtask',
    actionComponent: 'action',
    icon: { material: 'undo' },
  },
};
export default actions;
