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
      this._editSceneConfig(item, providerName);
    },
    async onPerformItemSceneDelete(event, item, sceneName) {
      await this.$view.dialog.confirm();
      // delete
      await this.$api.post('scene/delete', {
        sceneName,
      });
      // reload
      await this.load();
      // ok
      return true;
    },
    _editSceneConfig(item, sceneName) {
      this.$view.navigate(`/a/mail/scene/config?sceneName=${sceneName}`, {
        context: {
          params: {
            item,
            title: this._editSceneConfig_getTitle(item, sceneName),
            onSaveScene: async data => {
              await this._editSceneConfig_save(item, sceneName, data);
            },
          },
        },
      });
    },
    _editSceneConfig_getTitle(item, sceneName) {
      const title = this.$text('Config');
      return `${title}: ${sceneName}`;
    },
    async _editSceneConfig_save(item, sceneName, data) {
      // save
      const data2 = await this.$api.post('scene/save', {
        sceneName,
        data,
      });
      // change
      this.items[sceneName] = data2;
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
