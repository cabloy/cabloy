export default {
  methods: {
    getCascadeScope({ context, groupWhole }) {
      const scope = {};
      // groupWhole
      if (groupWhole) {
        scope.groupWhole = true;
      } else {
        scope.group = true;
      }
      // mobile/pc
      scope[this.$meta.vueApp.layout] = true;
      // small/medium/large
      scope[this.$view.size] = true;
      // readOnly: view/edit
      const readOnly = context.getReadOnly();
      if (readOnly) {
        scope.view = true;
      } else {
        scope.edit = true;
      }
      // ok
      return scope;
    },
  },
};
