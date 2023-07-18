// export
export default {
  installFactory,
};

// installFactory
function installFactory(_Vue) {
  const Vue = _Vue;
  const ebListLayoutManager = Vue.prototype.$meta.module.get('a-basefront').options.mixins.ebListLayoutManager;
  return {
    meta: {
      uses: 'a-basefront',
    },
    mixins: [ebListLayoutManager],
    props: {
      context: {
        type: Object,
      },
    },
    data() {
      const { parcel, property, validate } = this.context;
      return {
        container: {
          title: this.context.getTitle(true),
          mode: validate.host && validate.host.mode,
          flowTaskId: (validate.host && validate.host.flowTaskId) || 0,
          atomId: parcel.data.atomId,
          atom: parcel.data,
          detailClass: property.ebParams.detailClass,
          options: {},
          layout: null,
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
