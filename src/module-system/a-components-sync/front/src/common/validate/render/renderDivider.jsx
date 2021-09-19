export default {
  methods: {
    renderDivider(c /* , context*/) {
      return c('f7-list-item', {
        attrs: {
          divider: true,
        },
      });
    },
  },
};
