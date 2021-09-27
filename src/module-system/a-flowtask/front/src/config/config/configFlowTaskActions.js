const actions = {
  viewAtom: {
    basic: true,
    title: 'View',
    actionModule: 'a-flowtask',
    actionComponent: 'action',
    icon: { material: 'visibility' },
  },
  handleTask: {
    basic: true,
    title: 'Handle',
    actionModule: 'a-flowtask',
    actionComponent: 'action',
    icon: { material: 'play_arrow' },
  },
  cancelFlow: {
    basic: true,
    title: 'Cancel Flow',
    actionModule: 'a-flowtask',
    actionComponent: 'action',
    icon: { material: 'stop' },
  },
  assigneesConfirmation: {
    basic: true,
    title: 'Confirmation',
    actionModule: 'a-flowtask',
    actionComponent: 'action',
    icon: { material: 'group' },
  },
  recall: {
    basic: true,
    title: 'Recall',
    actionModule: 'a-flowtask',
    actionComponent: 'action',
    icon: { material: 'undo' },
  },
  appendRemark: {
    basic: true,
    title: 'AppendRemark',
    actionModule: 'a-flowtask',
    actionComponent: 'action',
    icon: { material: 'info' },
  },
};
export default actions;
