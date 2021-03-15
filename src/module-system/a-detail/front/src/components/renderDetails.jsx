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
        mode: this.context.validate.containerMode,
        atomId: this.context.data.atomId,
        atom: this.context.data,
        detailClass: this.context.property.ebOptions.detailClass,
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
