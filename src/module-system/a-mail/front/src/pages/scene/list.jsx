export default {
  data() {
    return {
      items: null,
    };
  },
  computed: {
    ready() {
      return !!this.items;
    },
  },
  created() {
    this.load();
  },
  methods: {
    async load() {
      try {
        // fetch
        this.items = await this.$api.post('scene/list');
      } catch (err) {
        this.$view.toast.show({ text: err.message });
      }
    },
    onPerformItem(event, item) {
      if (!this.getItemLink(item)) return;
      this._editSceneConfig(item, 'default');
    },
    _renderItem(item) {
      const fullName = this.getItemFullName(item);
      const meta = item.meta;
      const domActions = [];
      if (item.providerItem.disabled) {
        domActions.push(
          <div key="enable" color="orange" propsOnPerform={event => this.onPerformItemEnable(event, item)}>
            <f7-icon slot="media" f7="::play-arrow"></f7-icon>
            <div slot="title">{this.$text('Enable')}</div>
          </div>
        );
      } else {
        domActions.push(
          <div key="disable" color="red" propsOnPerform={event => this.onPerformItemDisable(event, item)}>
            <f7-icon slot="media" f7="::stop"></f7-icon>
            <div slot="title">{this.$text('Disable')}</div>
          </div>
        );
      }
      if (meta.scene) {
        domActions.push(
          <div key="create" color="blue" propsOnPerform={event => this.onPerformItemSceneAdd(event, item)}>
            <f7-icon slot="media" f7="::add"></f7-icon>
            <div slot="title">{this.$text('Create')}</div>
          </div>
        );
      }
      let domIcon;
      if (meta.icon) {
        domIcon = <f7-icon f7={meta.icon.f7} material={meta.icon.material}></f7-icon>;
      }
      return (
        <eb-list-item
          key={fullName}
          link={this.getItemLink(item)}
          propsOnPerform={event => this.onPerformItem(event, item)}
          swipeout
        >
          <div slot="title">{item.meta.titleLocale}</div>
          <div slot="media">{domIcon}</div>
          <eb-context-menu>
            <div slot="right">{domActions}</div>
          </eb-context-menu>
        </eb-list-item>
      );
    },

    _renderList() {
      if (!this.ready) return;
      const children = [];
      for (const item of this.items) {
        children.push(this._renderItem(item));
      }
      return (
        <f7-list form inline-labels no-hairlines-md>
          {children}
        </f7-list>
      );
    },
  },
  render() {
    return (
      <eb-page>
        <eb-navbar large largeTransparent title={this.$text('Mail Management')} eb-back-link="Back"></eb-navbar>
        {this._renderList()}
      </eb-page>
    );
  },
};
