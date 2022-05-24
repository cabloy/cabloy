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
        this.items = await this.$api.post('smsProvider/list');
      } catch (err) {
        this.$view.toast.show({ text: err.message });
      }
    },
    onPerformItem(event, item, providerName) {
      if (providerName === 'test') return;
      this._editItemConfig(item, providerName);
    },
    async onPerformItemSetCurrent(event, item, providerName) {
      // delete
      await this.$api.post('smsProvider/setCurrent', {
        providerName,
      });
      // reload
      await this.load();
      // ok
      return true;
    },
    _editItemConfig(item, providerName) {
      this.$view.navigate(`/a/authsms/smsProvider/config?providerName=${providerName}`, {
        context: {
          params: {
            item,
            title: this._editItemConfig_getTitle(item, providerName),
            onSaveProvider: async data => {
              await this._editItemConfig_save(item, providerName, data);
            },
          },
        },
      });
    },
    _editItemConfig_getTitle(item, providerName) {
      const title = this.$text('Config');
      return `${title}: ${providerName}`;
    },
    async _editItemConfig_save(item, providerName, data) {
      // save
      const data2 = await this.$api.post('smsProvider/save', {
        providerName,
        data,
      });
      // change
      this.items[providerName] = data2;
    },
    _renderItem(item, providerName) {
      // actions
      const domActions = [];
      if (!item.current) {
        domActions.push(
          <div
            key="actionSetCurrent"
            color="orange"
            propsOnPerform={event => this.onPerformItemSetCurrent(event, item, providerName)}
          >
            <f7-icon slot="media" f7="::done"></f7-icon>
            <div slot="title">{this.$text('SetCurrent')}</div>
          </div>
        );
      }
      let domContextMenu;
      if (domActions.length > 0) {
        domContextMenu = (
          <eb-context-menu>
            <div slot="right">{domActions}</div>
          </eb-context-menu>
        );
      }
      // icon
      let domIcon;
      if (item.current) {
        domIcon = <f7-icon slot="media" f7="::done"></f7-icon>;
      } else {
        domIcon = <div slot="media"></div>;
      }
      return (
        <eb-list-item
          key={providerName}
          link={providerName === 'test' ? false : '#'}
          propsOnPerform={event => this.onPerformItem(event, item, providerName)}
          swipeout
        >
          <div slot="title">{item.titleLocale}</div>
          {domIcon}
          {domContextMenu}
        </eb-list-item>
      );
    },

    _renderList() {
      if (!this.ready) return;
      const children = [];
      for (const providerName in this.items) {
        const item = this.items[providerName];
        children.push(this._renderItem(item, providerName));
      }
      return <f7-list>{children}</f7-list>;
    },
  },
  render() {
    return (
      <eb-page>
        <eb-navbar large largeTransparent title={this.$text('SMS Management')} eb-back-link="Back"></eb-navbar>
        {this._renderList()}
      </eb-page>
    );
  },
};
