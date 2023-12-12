export default {
  methods: {
    _getTabsCount() {
      // no tabs
      if (this.tabs.length === 0) return 1;
      // more tabs
      if (this.tabs.length > 1) {
        return 1 + this.tabs.length;
      }
      // only one
      const tab = this.tabs[0];
      console.log(tab);
      // array/tree
      const dict = tab.dict;
      if (!dict) return 1;
      const dictMode = dict.dictMode;
      if (dictMode === 1) {
        // tree
      } else {
        // array
      }
      return this.tabs.length;
    },
    _renderTabs() {
      const tabsCount = this._getTabsCount();
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
