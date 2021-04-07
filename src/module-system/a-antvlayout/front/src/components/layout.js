import layout from '@antv/layout';

export default {
  meta: {
    global: false,
  },
  methods: {
    onAction({ action }) {
      if (action.name === 'instance') return layout;
    },
  },
};
