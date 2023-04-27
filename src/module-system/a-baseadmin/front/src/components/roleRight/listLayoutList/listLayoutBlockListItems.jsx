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
    return {};
  },
  computed: {
    itemKey() {
      return this.layoutManager.data.provider.itemKey;
    },
    ready() {
      return this.modulesAll && this.atomClassesAll && this.actionsAll;
    },
    itemGroups() {
      const items = this.layoutManager.data_getItems();
      if (!items) return [];
      const groups = [];
      let group = null;
      for (const item of items) {
        // group
        const groupName = `${item.moduleTarget}.${item.atomClassNameTarget}`;
        if (!group || group.id !== groupName) {
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
          groups.push(group);
        }
        // item
        if (item.actionMode === 1) {
          item.title = item.actionName;
          item.titleLocale = item.actionNameLocale;
        } else {
          const action = this.getAction({
            module: item.moduleTarget,
            atomClassName: item.atomClassNameTarget,
            name: item.actionName,
          });
          item._action = action;
          if (!action) {
            item.title = item.actionName;
            item.titleLocale = `${item.actionName} - ${this.$text('ActionObsoletedTitle')}`;
          } else {
            item.title = action.title;
            item.titleLocale = action.titleLocale;
          }
        }
        // push
        group.items.push(item);
      }
      return groups;
    },
  },
  methods: {
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
          <f7-list-item group-title title={`${group.atomClassTitle} [${group.moduleTitle}]`}></f7-list-item>
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
