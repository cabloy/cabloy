export default {
  methods: {
    _getTabsCount() {
      return 1 + this._getTabsCount_inner();
    },
    _getTabsCount_inner() {
      // no tabs
      if (this.tabs.length === 0) return 0;
      // more tabs
      if (this.tabs.length > 1) {
        return this.tabs.length;
      }
      // only one
      const tab = this.tabs[0];
      // array/tree
      const dict = tab.dict;
      if (!dict) return 1; // not ready
      return dict._dictItems.length;
    },
    _getTabsEven(tabsCount) {
      const configEven = this.blockOptions.left.even;
      if (!configEven) return false;
      // min
      if (tabsCount < configEven.min) return false;
      // max
      if (configEven.max !== -1 && tabsCount > configEven.max) return false;
      // even
      return true;
    },
    _renderTabs() {
      // tabsCount
      const tabsCount = this._getTabsCount();
      // even
      const tabsEven = this._getTabsEven(tabsCount);
      // domTabLinks
      const domTabLinks = [];
      // all
      domTabLinks.push(<eb-link tabLink="#11" tabLinkActive text={this.$text('All')}></eb-link>);
      domTabLinks.push(<eb-link tabLink="#11" tabLinkActive text={this.$text('All')}></eb-link>);
      domTabLinks.push(<eb-link tabLink="#11" tabLinkActive text={this.$text('All')}></eb-link>);

      return (
        <div class="actions-block actions-block-left actions-block-left-tabs">
          <f7-toolbar top tabbar scrollable={!tabsEven}>
            {domTabLinks}
          </f7-toolbar>
        </div>
      );
    },
  },
};
