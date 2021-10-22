import chartjs from 'chart.js';

export default {
  meta: {
    global: false,
  },
  methods: {
    onAction({ action }) {
      if (action.name === 'instance') {
        if (!chartjs) throw new Error('chart.js should not be null');
        return chartjs;
      }
    },
  },
};
