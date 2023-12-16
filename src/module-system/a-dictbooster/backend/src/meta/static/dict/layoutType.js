const dictItems = [
  {
    code: 0,
    title: 'General',
  },
  {
    code: 1,
    title: 'LayoutMobile',
  },
  {
    code: 2,
    title: 'LayoutPC',
  },
  {
    code: 3,
    title: 'AtomList',
  },
  {
    code: 4,
    title: 'AtomItem',
  },
  {
    code: 5,
    title: 'DetailList',
  },
  {
    code: 6,
    title: 'DetailItem',
  },
  {
    code: 7,
    title: 'MessageGroup',
  },
  {
    code: 8,
    title: 'MessageList',
  },
  {
    code: 9,
    title: 'FlowList',
  },
  {
    code: 10,
    title: 'FlowItem',
  },
  {
    code: 11,
    title: 'FlowTaskList',
  },
  {
    code: 12,
    title: 'FlowTaskAtom',
  },
  {
    code: 13,
    title: 'AppMenu',
  },
  {
    code: 14,
    title: 'AppMine',
  },
];
const dictLocales = {
  'en-us': {
    LayoutMobile: 'Mobile Layout',
    LayoutPC: 'PC Layout',
    AtomList: 'Data List',
    AtomItem: 'Data Item',
    DetailList: 'Detail List',
    DetailItem: 'Detail Item',
    MessageGroup: 'Message Group',
    MessageList: 'Message List',
    FlowList: 'Flow List',
    FlowItem: 'Flow Item',
    FlowTaskList: 'Flow Task List',
    FlowTaskAtom: 'Flow Task Data',
    AppMenu: 'App Menu',
    AppMine: 'App Mine',
  },
  'zh-cn': {
    General: '通用',
    LayoutMobile: '移动布局',
    LayoutPC: 'PC布局',
    AtomList: '数据列表',
    AtomItem: '数据条目',
    DetailList: '明细列表',
    DetailItem: '明细条目',
    MessageGroup: '消息组',
    MessageList: '消息列表',
    FlowList: '流程列表',
    FlowItem: '流程条目',
    FlowTaskList: '流程任务列表',
    FlowTaskAtom: '流程任务数据',
    AppMenu: '应用菜单',
    AppMine: '我的页面',
  },
};
const definition = {
  atomName: 'Layout Type',
  atomStaticKey: 'dictLayoutType',
  atomRevision: 2,
  description: '',
  dictItems: JSON.stringify(dictItems),
  dictLocales: JSON.stringify(dictLocales),
  resourceRoles: 'root',
};
module.exports = definition;
