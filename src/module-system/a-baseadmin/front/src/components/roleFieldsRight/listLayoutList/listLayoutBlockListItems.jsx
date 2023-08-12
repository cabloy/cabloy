import Vue from 'vue';
const ebModules = Vue.prototype.$meta.module.get('a-base').options.mixins.ebModules;
const ebAtomClasses = Vue.prototype.$meta.module.get('a-base').options.mixins.ebAtomClasses;
const ebAtomActions = Vue.prototype.$meta.module.get('a-base').options.mixins.ebAtomActions;
export default {
  meta: {
    global: false,
  },
  mixins: [ebModules, ebAtomClasses, ebAtomActions],
  props: {
    layoutManager: {
      type: Object,
    },
    layout: {
      type: Object,
    },
    blockConfig: {
      type: Object,
    },
  },
  data() {
    return {
      useStoreFieldsRightMode: null,
    };
  },
  computed: {
    itemKey() {
      return this.layoutManager.data.provider.itemKey;
    },
    ready() {
      return this.useStoreFieldsRightMode && this.modulesAll && this.atomClassesAll && this.actionsAll;
    },
    itemGroups() {
      const items = this.layoutManager.data_getItems();
      if (!items) return [];
      const groups = [];
      let group = null;
      for (const item of items) {
        // group
        const groupName = item.atomClassIdTarget ? `${item.moduleTarget}.${item.atomClassNameTarget}` : null;
        if (!group || group.id !== groupName) {
          if (item.atomClassIdTarget) {
            const module = this.getModule(item.moduleTarget);
            const atomClass = this.getAtomClass({
              module: item.moduleTarget,
              atomClassName: item.atomClassNameTarget,
            });
            group = {
              id: groupName,
              atomClassTitle: atomClass.titleLocale,
              moduleTitle: module.titleLocale,
              items: [],
            };
          } else {
            group = {
              id: groupName,
              atomClassTitle: this.$text('Not Specified'),
              moduleTitle: null,
              items: [],
            };
          }
          groups.push(group);
        }
        // item
        item._fieldsRight = item.fieldsRight ? JSON.parse(item.fieldsRight) : null;
        const mode = this.useStoreFieldsRightMode.getMode({ value: item._fieldsRight?.mode });
        item.title = mode.title;
        item.titleLocale = this.$text(mode.title);
        // push
        group.items.push(item);
      }
      return groups;
    },
  },
  created() {
    this.init();
  },
  methods: {
    async init() {
      this.useStoreFieldsRightMode = await this.$store.use('a/fields/fieldsRightMode');
    },
    _renderGroup(group) {
      const children = [];
      for (const item of group.items) {
        const domListItem = this.layoutManager.layout_renderBlock({
          blockName: 'item',
          key: item[this.itemKey],
          info: { item },
          listItem: true,
        });
        children.push(domListItem);
      }
      return (
        <f7-list-group key={group.id}>
          <f7-list-item group-title>
            <div>{group.atomClassTitle}</div>
            <div class="item-after">{group.id}</div>
          </f7-list-item>
          {children}
        </f7-list-group>
      );
    },
    _renderList() {
      if (!this.ready) return null;
      // groups
      const children = [];
      for (const group of this.itemGroups) {
        children.push(this._renderGroup(group));
      }
      return <f7-list>{children}</f7-list>;
    },
  },
  render() {
    return <div>{this._renderList()}</div>;
  },
};
