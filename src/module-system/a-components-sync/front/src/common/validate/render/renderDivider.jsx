export default {
  methods: {
    renderDivider(c, context) {
      const { key } = context;
      return c('f7-list-item', {
        key,
        attrs: {
          divider: true,
        },
      });
    },
  },
};
