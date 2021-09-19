export default {
  methods: {
    renderDivider(context) {
      const { key } = context;
      return <f7-list-item key={key} divider={true}></f7-list-item>;
    },
  },
};
