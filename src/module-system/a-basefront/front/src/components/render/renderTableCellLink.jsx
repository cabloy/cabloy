import Vue from 'vue';
const ebRenderTableCellFormat = Vue.prototype.$meta.module.get('a-base').options.mixins.ebRenderTableCellFormat;

export default {
  meta: {
    global: false,
  },
  mixins: [ebRenderTableCellFormat],
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
    link: {
      type: Object, // text/href/target/external
    },
  },
  data() {
    return {};
  },
  methods: {
    _renderLink(link) {
      const { text, record, column } = this.info;
      // text
      let _text = this.$meta.util.replaceTemplate(link.text, record) || text || '';
      _text = this.formatText({ text: _text, column });
      // href
      const href = this.$meta.util.replaceTemplate(link.href, record);
      // target
      const target = link.target;
      // external
      const external = link.external;
      // render
      return (
        <eb-link ebHref={href} ebTarget={target} externalLink={external}>
          {_text}
        </eb-link>
      );
    },
  },
  render() {
    return <div class="eb-antdv-table-cell eb-antdv-table-cell-link">{this._renderLink(this.link)}</div>;
  },
};
