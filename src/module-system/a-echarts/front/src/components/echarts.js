import * as echarts from 'echarts';

export default {
  meta: {
    global: false,
  },
  methods: {
    onAction({ action }) {
      const actionName = action.actionName || action.name;
      if (actionName === 'instance') {
        if (!echarts) throw new Error('echarts should not be null');
        return echarts;
      }
    },
  },
};
