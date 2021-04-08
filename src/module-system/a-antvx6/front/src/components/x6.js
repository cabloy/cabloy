import * as x6 from '@antv/x6';

export default {
  meta: {
    global: false,
  },
  methods: {
    onAction({ action }) {
      if (action.name === 'instance') return x6;
    },
  },
};
