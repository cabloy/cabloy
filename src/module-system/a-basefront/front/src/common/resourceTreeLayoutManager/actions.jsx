import Vue from 'vue';
export default {
  data() {
    return {
      actions: {
        list: null,
        layoutPopoverId: Vue.prototype.$meta.util.nextId('popover'),
      },
    };
  },
  methods: {
    async actions_onActionLayout(event, layout) {
      // change layout
      await this.layout_prepareConfig(layout.name);
      // save
      this.$store.commit('a/base/setLayoutConfigKey', {
        module: 'a-basefront', key: 'resource.tree.layout', value: layout.name,
      });
    },
    actions_render() {
      if (!this.base_ready) return null;
      const children = [];
      // layout
      children.push(
        <f7-link key="actionsLayout" iconMaterial="view_list" popover-open={`#${this.actions.layoutPopoverId}`}></f7-link>
      );
      //
      return children;
    },
    actions_renderPopover() {
      if (!this.base_ready) return null;
      // layouts
      const layouts = this.$meta.util.getProperty(this.base.config, 'render.tree.info.layouts');
      const children = [];
      for (const layout of layouts) {
        children.push(
          <eb-list-item key={layout.name} link="#" popover-close propsOnPerform={event => this.actions_onActionLayout(event, layout)}>
            <f7-icon slot="media" material={this.layout.current === layout.name ? 'done' : ''}></f7-icon>
            <div slot="title">{this.$text(layout.title)}</div>
          </eb-list-item>
        );
      }
      // list
      const domList = (
        <f7-list inset>
          {children}
        </f7-list>
      );
      return (
        <f7-popover id={this.actions.layoutPopoverId}>
          {domList}
        </f7-popover>
      );
    },
  },
};
