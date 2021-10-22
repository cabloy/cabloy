import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

export default {
  meta: {
    global: false,
  },
  methods: {
    onAction({ action }) {
      if (action.name === 'instance') {
        if (!Chart) throw new Error('chart.js should not be null');
        return Chart;
      }
    },
  },
};
