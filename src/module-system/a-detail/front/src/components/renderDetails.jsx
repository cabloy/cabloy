import listLayoutManager from '../common/listLayoutManager/index.jsx';

export default {
  mixins: [ listLayoutManager ],
  props: {
    context: {
      type: Object,
    },
  },
  data() {
    return {
      container: {
        title: this.context.getTitle(true),
        mode: this.context.validate.containerMode,
        flowTaskId: (this.context.validate.meta && this.context.validate.meta.flowTaskId) || 0,
        atomId: this.context.data.atomId,
        atom: this.context.data,
        detailClass: this.context.property.ebParams.detailClass,
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
