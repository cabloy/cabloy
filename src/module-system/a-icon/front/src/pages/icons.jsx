import Vue from 'vue';
const ebClipboard = Vue.prototype.$meta.module.get('a-components').options.mixins.ebClipboard;
export default {
  mixins: [ebClipboard],
  data() {
    return {
      iconsAll: null,
      query: null,
    };
  },
  computed: {
    pageTitle() {
      return this.$text('Icons');
    },
  },
  created() {
    this.onSearchbarSearch = this.$meta.util.debounce((searchbar, query) => {
      this._onSearch(query);
    }, 300);
    this._loadIcons();
  },
  methods: {
    onClickCopy(svg) {
      this.$meta.util.clipboard.copy(svg, { ctx: this });
    },
    onClickEnable() {
      this.$refs.searchbar.f7Searchbar.enable(true);
    },
    _onSearch(query) {
      this.query = query;
      this._resetClipboards();
    },
    _resetClipboards() {
      this.$nextTick(() => {
        this.removeAllClipboardTriggers();
        const domCells = this.$$('.box-grid-cell', this.$el);
        for (let index = 0; index < domCells.length; index++) {
          this.addClipboardTrigger(domCells[index]);
        }
      });
    },
    async _loadIcons() {
      this.iconsAll = await this.$api.post('icon/getIcons');
      this._resetClipboards();
    },
    _combineIconName(moduleName, groupName, icon) {
      if (moduleName === 'a-iconbooster') moduleName = '';
      if (groupName === 'default') groupName = '';
      return `${moduleName}:${groupName}:${icon}`;
    },
    _renderIcons() {
      if (!this.iconsAll) return null;
      const children = [];
      for (const moduleName in this.iconsAll) {
        const moduleIcons = this.iconsAll[moduleName];
        const domModule = this._renderIconsModule({ moduleName, moduleIcons });
        if (domModule) {
          children.push(domModule);
        }
      }
      return (
        <f7-list inline-labels no-hairlines-md>
          {children}
        </f7-list>
      );
    },
    _renderIconsModule({ moduleName, moduleIcons }) {
      const children = [];
      const groupKeys = Object.keys(moduleIcons);
      const groupSingle = groupKeys.length === 1;
      for (const groupName in moduleIcons) {
        const groupIcons = moduleIcons[groupName];
        const domGroup = this._renderIconsGroup({ moduleName, groupName, groupIcons, groupSingle });
        if (domGroup) {
          children.push(domGroup);
        }
      }
      if (children.length === 0) return null;
      return (
        <f7-list-group key={moduleName}>
          <f7-list-item group-title title={moduleName}></f7-list-item>
          {children}
        </f7-list-group>
      );
    },
    _renderIconsGroup({ moduleName, groupName, groupIcons, groupSingle }) {
      if (!groupIcons) return null;
      const children = [];
      groupIcons = groupIcons.split(',');
      for (const icon of groupIcons) {
        if (this.query && icon.indexOf(this.query) === -1) continue;
        const svg = this._combineIconName(moduleName, groupName, icon);
        children.push(
          <div key={icon} class="box-grid-cell" onClick={() => this.onClickCopy(svg)}>
            <div class="box-grid-cell-icon">
              <f7-icon f7={svg} size="24"></f7-icon>
            </div>
            <div class="box-grid-cell-label">{icon}</div>
          </div>
        );
      }
      // not found
      if (children.length === 0) return null;
      // single
      const domListItem = (
        <f7-list-item>
          <div class="eb-box-grid-row">{children}</div>
        </f7-list-item>
      );
      if (groupSingle) return domListItem;
      // multiple
      return (
        <f7-list-group key={groupName}>
          <f7-list-item group-title title={groupName}></f7-list-item>
          {domListItem}
        </f7-list-group>
      );
    },
  },
  render() {
    return (
      <eb-page>
        <eb-navbar title={this.pageTitle} eb-back-link="Back">
          <f7-nav-right>
            <f7-link iconF7="::search" onClick={this.onClickEnable}></f7-link>
          </f7-nav-right>
          <f7-searchbar
            ref="searchbar"
            onSearchbarSearch={this.onSearchbarSearch}
            expandable
            search-container=".search-list"
            search-in=".item-title"
            placeholder={this.pageTitle}
            backdrop={false}
            disable-button={true}
            clear-button={true}
            custom-search={true}
          ></f7-searchbar>
        </eb-navbar>
        {this._renderIcons()}
      </eb-page>
    );
  },
};
