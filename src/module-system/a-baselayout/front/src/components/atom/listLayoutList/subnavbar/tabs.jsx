export default {
  methods: {
    _getTabsCount() {},
    _renderTabs() {
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
