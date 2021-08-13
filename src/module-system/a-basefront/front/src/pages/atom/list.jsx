import listLayoutManager from '../../common/listLayoutManager/index.jsx';
export default {
  mixins: [listLayoutManager],
  data() {
    const query = this.$f7route.query;
    const module = query && query.module;
    const atomClassName = query && query.atomClassName;
    const atomClass = module && atomClassName ? { module, atomClassName } : null;
    const options = query && query.options ? JSON.parse(query.options) : null;
    const params = query && query.params ? JSON.parse(query.params) : null;
    const scene = query && query.scene;
    const layout = query && query.layout;
    return {
      container: {
        atomClass,
        options,
        params,
        scene,
        layout,
      },
    };
  },
  render() {
    let domToolbar;
    if (this.bottombar.enable) {
      domToolbar = <f7-toolbar position="bottom">{this.layout.instance && this.bottombar.enable && this.layout_renderBlock({ blockName: 'bottombar' })}</f7-toolbar>;
    }
    return (
      <eb-page withSubnavbar={this.subnavbar.enable} ptr onPtrRefresh={this.page_onRefresh} infinite infinitePreloader={false} onInfinite={this.page_onInfinite}>
        <eb-navbar eb-back-link="Back">
          {this.layout_renderBlock({ blockName: 'caption' })}
          {this.layout_renderBlock({ blockName: 'title' })}
          {this.layout.instance && this.subnavbar.enable && this.layout_renderBlock({ blockName: 'subnavbar' })}
        </eb-navbar>
        {domToolbar}
        {this.layout_renderLayout()}
      </eb-page>
    );
  },
};
