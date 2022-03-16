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
      for (const providerFullName in this.items) {
        const item = this.items[providerFullName];
        if (item.providerItem.disabled) {
          this.itemsGroups[1].items.push(item);
        } else {
          this.itemsGroups[0].items.push(item);
        }
      }
    },
    getItemLink(item) {
      return item.meta && item.meta.mode === 'redirect' ? '#' : false;
    },
    getItemHref(item) {
      return item.meta && item.meta.mode === 'redirect' ? `auth/info?id=${item.id}` : '';
    },
    getItemTitle(item) {
      return item.meta ? item.meta.titleLocale : `${item.module}:${item.providerName}`;
    },
    onPerformDisable(event, item) {
      return this.onDisable(event, item, 1);
    },
    onPerformEnable(event, item) {
      return this.onDisable(event, item, 0);
    },
    onDisable(event, item, disabled) {
      return this.$api.post('auth/disable', { id: item.id, disabled }).then(() => {
        const index = this.items.findIndex(_item => _item.id === item.id);
        this.items[index].disabled = disabled;
        this.groupItems();
        this.$meta.util.swipeoutClose(event.currentTarget);
        return true;
      });
    },
    _renderItem(item) {
      let domAction;
      if (item.providerItem.disabled) {
        domAction = (
          <div color="orange" propsOnPerform={this.onPerformEnable}>
            {this.$text('Enable')}
          </div>
        );
      } else {
        domAction = (
          <div color="red" propsOnPerform={this.onPerformDisable}>
            {this.$text('Disable')}
          </div>
        );
      }
      return (
        <eb-list-item key={item.id} link={this.getItemLink(item)} eb-href={this.getItemHref(item)} swipeout>
          <div slot="title">{this.getItemTitle(item)}</div>
          <eb-context-menu>
            <div slot="right">{domAction}</div>
          </eb-context-menu>
        </eb-list-item>
      );
    },
    _renderGroup(group) {
      const children = [];
      children.push(<f7-list-item group-title title={`${group.title} (${group.items.length})`}></f7-list-item>);
      for (const item of group.items) {
        children.push(this._renderItem(item));
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
