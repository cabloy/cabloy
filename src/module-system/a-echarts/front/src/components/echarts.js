import * as echarts from 'echarts';

export default {
  meta: {
    global: false,
  },
  methods: {
    onAction({ action }) {
      if (action.name === 'instance') {
        if (!echarts) throw new Error('echarts should not be null');
        return echarts;
      }
    },
  },
};
