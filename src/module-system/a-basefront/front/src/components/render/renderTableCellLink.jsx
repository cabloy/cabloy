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
      const props = {};
      // text
      let _text = this.$meta.util.replaceTemplate(link.text, record) || text || '';
      _text = this.formatText({ text: _text, column });
      // href
      if (link.href) {
        props.ebHref = this.$meta.util.replaceTemplate(link.href, record);
      }
      // target/external
      if (link.external === true) {
        props.link = false;
        props.externalLink = false;
        props.external = true;
        props.target = link.target;
      } else {
        props.link = true;
        props.externalLink = true;
        props.external = false;
        props.ebTarget = link.target;
      }
      // render
      return <eb-link {...{ props }}>{_text}</eb-link>;
    },
  },
  render() {
    if (!this.link && !this.links) {
      return <div></div>;
    }
    return <div class="eb-antdv-table-cell eb-antdv-table-cell-link">{this._renderLink(this.link)}</div>;
  },
};
