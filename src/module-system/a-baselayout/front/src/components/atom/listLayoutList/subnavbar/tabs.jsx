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
    _renderTabs() {
      const tabsCount = this._getTabsCount();
      console.log(tabsCount);
      const domTabLinks = [];
      domTabLinks.push(<eb-button class="col">aaa</eb-button>);
      domTabLinks.push(<eb-button class="col">aaa</eb-button>);
      domTabLinks.push(<eb-button class="col">aaa</eb-button>);
      domTabLinks.push(<eb-button class="col">aaa</eb-button>);
      domTabLinks.push(<eb-button class="col">aaa</eb-button>);
      domTabLinks.push(<eb-button class="col">aaa</eb-button>);
      domTabLinks.push(<eb-button class="col">aaa</eb-button>);
      domTabLinks.push(<eb-button class="col">aaa</eb-button>);
      domTabLinks.push(
        <f7-col>
          <eb-button outline>BBB</eb-button>
        </f7-col>
      );
      domTabLinks.push(
        <f7-col>
          <eb-button>CCC</eb-button>
        </f7-col>
      );

      return (
        <div class="actions-block actions-block-left actions-block-left-tabs eb-scrollable row">{domTabLinks}</div>
      );
    },
  },
};
