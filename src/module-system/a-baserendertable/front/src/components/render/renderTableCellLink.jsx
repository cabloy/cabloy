import Vue from 'vue';
const ebRenderTableCellBase = Vue.prototype.$meta.module.get('a-base').options.mixins.ebRenderTableCellBase;

export default {
  mixins: [ebRenderTableCellBase],
  data() {
    return {};
  },
  computed: {
    link() {
      // text/href/target/external
      return this.base_getParam({ name: 'link' });
    },
    links() {
      return this.base_getParam({ name: 'links' });
    },
  },
  methods: {
    _renderLink(link) {
      const { text, record } = this.info;
      const props = {};
      // text
      let _text = this.$meta.util.replaceTemplate(link.text, record) || text || '';
      _text = this.base_formatText({ text: _text });
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
      return (
        <eb-link key={_text} {...{ props }}>
          {_text}
        </eb-link>
      );
    },
    _renderLinks(links) {
      const children = [];
      for (const link of links) {
        children.push(this._renderLink(link));
      }
      return children;
    },
  },
  render() {
    if (!this.link && !this.links) {
      return <div></div>;
    }
    if (this.link) {
      return <div class="eb-antdv-table-cell eb-antdv-table-cell-link">{this._renderLink(this.link)}</div>;
    }
    return <div class="eb-antdv-table-cell eb-antdv-table-cell-links">{this._renderLinks(this.links)}</div>;
  },
};
