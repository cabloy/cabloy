import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

export default {
  meta: {
    global: false,
  },
  methods: {
    onAction({ action }) {
      const actionName = action.actionName || action.name;
      if (actionName === 'instance') {
        if (!Chart) throw new Error('chart.js should not be null');
        return Chart;
      }
    },
  },
};
