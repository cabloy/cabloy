import Vue from 'vue';
const ebRenderTableCellFormat = Vue.prototype.$meta.module.get('a-base').options.mixins.ebRenderTableCellFormat;

export default {
  meta: {
    global: false,
  },
  mixins: [ ebRenderTableCellFormat ],
  props: {
    layoutManager: {
      type: Object,
    },
    layout: {
      type: Object,
    },
    layoutItems: {
      type: Object,
    },
    info: {
      type: Object,
    },
    expression: {
      type: String,
    },
  },
  data() {
    return {
    };
  },
  methods: {
  },
  render() {
    const text = this.formatText();
    return <div class="eb-antdv-table-cell" title={text}>{text}</div>;
  },
};
