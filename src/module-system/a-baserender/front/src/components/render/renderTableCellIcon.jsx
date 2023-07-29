import Vue from 'vue';
const ebRenderTableCellBase = Vue.prototype.$meta.module.get('a-base').options.mixins.ebRenderTableCellBase;

export default {
  mixins: [ebRenderTableCellBase],
  data() {
    return {};
  },
  computed: {
    size() {
      return this.base_getParam({ name: 'size' });
    },
  },
  created() {},
  methods: {
    _renderMedia() {
      const text = this.info.text;
      if (!text) return null;
      return <f7-icon f7={text} size={this.size}></f7-icon>;
    },
  },
  render() {
    // avatar
    const domMedia = this._renderMedia();
    return <div>{domMedia}</div>;
  },
};
