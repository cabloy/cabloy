import listLayoutManager from '../common/listLayoutManager/index.jsx';

export default {
  mixins: [ listLayoutManager ],
  props: {
    context: {
      type: Object,
    },
  },
  data() {
    const options = {
      atomId: this.context.data.atomId,
      atom: this.context.data,
      detailClass: this.context.property.ebOptions.detailClass,
    };
    return {
      container: {
        options,
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
