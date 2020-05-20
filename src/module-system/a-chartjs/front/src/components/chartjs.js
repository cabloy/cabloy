import chartjs from 'chart.js';

export default {
  meta: {
    global: false,
  },
  methods: {
    onAction({ action }) {
      if (action.name === 'instance') return chartjs;
    },
  },
};
