import g6 from '@antv/g6';

export default {
  meta: {
    global: false,
  },
  methods: {
    onAction({ action }) {
      if (action.name === 'instance') return g6;
    },
  },
};
