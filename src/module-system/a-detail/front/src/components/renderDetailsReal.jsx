// export
export default {
  meta: {
    uses: 'a-basefront',
  },
  installFactory,
};

// installFactory
function installFactory(_Vue) {
  const Vue = _Vue;
  const ebListLayoutManager = Vue.prototype.$meta.module.get('a-basefront').options.mixins.ebListLayoutManager;
  return {
    mixins: [ebListLayoutManager],
    props: {
      context: {
        type: Object,
      },
    },
    data() {
      const { parcel, property, validate } = this.context;
      const options = {
        atomIdMain: parcel.data.atomId,
        atomMain: parcel.data,
      };
      if (validate.host?.flowTaskId) {
        options.flowTaskId = validate.host?.flowTaskId;
      }
      if (validate.host?.formAction) {
        options.formActionMain = validate.host?.formAction;
      }
      const params = {
        pageTitle: this.context.getTitle(true),
      };
      return {
        container: {
          atomClass: property.ebParams.atomClass,
          options,
          params,
          scene: null,
          layout: null,
          mode: validate.host && validate.host.mode,
          layoutKeyBase: 'a-detail:layoutDetailListBase',
        },
      };
    },
    created() {},
    methods: {},
    render() {
      return <div>{this.layout_renderLayout()}</div>;
    },
  };
}
