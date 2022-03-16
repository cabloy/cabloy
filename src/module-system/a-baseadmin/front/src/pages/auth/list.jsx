import Vue from 'vue';
const ebModules = Vue.prototype.$meta.module.get('a-base').options.mixins.ebModules;
export default {
  mixins: [ebModules],
  data() {
    return {
      items: null,
      itemsGroups: null,
    };
  },
  computed: {
    ready() {
      return this.modulesAll && this.items;
    },
  },
  created() {
    this.load();
  },
  methods: {
    async load() {
      // fetch
      this.items = await this.$api.post('auth/list');
      this.groupItems();
    },
    groupItems() {
      this.itemsGroups = [
        { id: 'enabled', title: this.$text('Enabled'), items: [] },
        { id: 'disabled', title: this.$text('Disabled'), items: [] },
      ];
      for (const item of this.items) {
        if (item.providerItem.disabled) {
          this.itemsGroups[1].items.push(item);
        } else {
          this.itemsGroups[0].items.push(item);
        }
      }
    },
    getItemLink(item) {
      const meta = item.meta;
      return !meta.scene && meta.validator ? '#' : false;
    },
    getItemTitle(item) {
      const meta = item.meta;
      return meta.titleLocale;
    },
    getItemFullName(item) {
      return `${item.module}:${item.providerName}`;
    },
    onPerformItem(event, item) {},
    onPerformItemDisable(event, item) {
      return this.onItemDisable(event, item, 1);
    },
    onPerformItemEnable(event, item) {
      return this.onItemDisable(event, item, 0);
    },
    async onItemDisable(event, item, disabled) {
      await this.$api.post('auth/disable', { id: item.id, disabled });
      const index = this.items.findIndex(_item => _item.id === item.id);
      this.items[index].disabled = disabled;
      this.groupItems();
      this.$meta.util.swipeoutClose(event.currentTarget);
      return true;
    },
    _renderItemDirect(item) {
      const fullName = this.getItemFullName(item);
      let domAction;
      if (item.providerItem.disabled) {
        domAction = (
          <div color="orange" propsOnPerform={this.onPerformItemEnable}>
            {this.$text('Enable')}
          </div>
        );
      } else {
        domAction = (
          <div color="red" propsOnPerform={this.onPerformItemDisable}>
            {this.$text('Disable')}
          </div>
        );
      }
      return (
        <eb-list-item
          key={fullName}
          link={this.getItemLink(item)}
          propsOnPerform={event => this.onPerformItem(event, item)}
          swipeout
        >
          <div slot="title">{this.getItemTitle(item)}</div>
          <eb-context-menu>
            <div slot="right">{domAction}</div>
          </eb-context-menu>
        </eb-list-item>
      );
    },
    _renderItemScene(item, scene, sceneName) {
      let domAction;
      if (scene.disabled) {
        domAction = (
          <div color="orange" propsOnPerform={this.onPerformItemSceneEnable}>
            {this.$text('Enable')}
          </div>
        );
      } else {
        domAction = (
          <div color="red" propsOnPerform={this.onPerformItemSceneDisable}>
            {this.$text('Disable')}
          </div>
        );
      }
      return (
        <eb-list-item
          key={sceneName}
          link="#"
          propsOnPerform={event => this.onPerformItemScene(event, item, scene)}
          swipeout
        >
          <div slot="title">{scene.titleLocale}</div>
          <eb-context-menu>
            <div slot="right">{domAction}</div>
          </eb-context-menu>
        </eb-list-item>
      );
    },
    _renderItem(item) {
      const fullName = this.getItemFullName(item);
      const meta = item.meta;
      const domItemDirect = this._renderItemDirect(item);
      // scene: false
      if (!meta.scene) {
        return domItemDirect;
      }
      // scene: true
      const childrenScenes = [];
      for (const sceneName in item.scenes) {
        const scene = item.scenes[sceneName];
        childrenScenes.push(this._renderItemScene(item, scene, sceneName));
      }
      const children = [domItemDirect];
      children.push(<f7-list-group key={fullName + ':scenes'}>{childrenScenes}</f7-list-group>);
      return children;
    },
    _renderGroup(group) {
      let children = [];
      children.push(<f7-list-item group-title title={`${group.title} (${group.items.length})`}></f7-list-item>);
      for (const item of group.items) {
        const domItem = this._renderItem(item);
        if (Array.isArray(domItem)) {
          children = children.concat(domItem);
        } else {
          children.push(domItem);
        }
      }
      return <f7-list-group key={group.id}>{children}</f7-list-group>;
    },
    _renderList() {
      if (!this.ready) return;
      const children = [];
      for (const group of this.itemsGroups) {
        children.push(this._renderGroup(group));
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
        <eb-navbar large largeTransparent title={this.$text('Auth Management')} eb-back-link="Back"></eb-navbar>
        {this._renderList()}
      </eb-page>
    );
  },
};
