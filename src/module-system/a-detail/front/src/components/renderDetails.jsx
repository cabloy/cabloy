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
        flowTaskId: (validate.host && validate.host.flowTaskId) || 0,
      };
      const params = {
        pageTitle: this.context.getTitle(true),
      };
      return {
        container: {
          atomClass: property.ebParams.detailClass,
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
      return this.layout_renderLayout();
    },
  };
}
