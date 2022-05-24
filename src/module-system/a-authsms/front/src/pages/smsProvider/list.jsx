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
        this.items = await this.$api.post('scene/list');
      } catch (err) {
        this.$view.toast.show({ text: err.message });
      }
    },
    onPerformItem(event, item, sceneName) {
      this._editSceneConfig(item, sceneName);
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
    async onPerformItemSceneAdd() {
      // sceneName
      const sceneName = await this.$view.dialog.prompt(this.$text('Please specify the scene name'));
      if (!sceneName || this.items[sceneName]) return;
      // add
      const title = sceneName.replace(sceneName[0], sceneName[0].toUpperCase());
      await this.$api.post('scene/add', {
        sceneName,
        data: {
          title,
        },
      });
      // reload
      await this.load();
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
    _renderItem(item, sceneName) {
      const domActions = [];
      domActions.push(
        <div
          key="actionDelete"
          color="red"
          propsOnPerform={event => this.onPerformItemSceneDelete(event, item, sceneName)}
        >
          <f7-icon slot="media" f7="::delete"></f7-icon>
          <div slot="title">{this.$text('Delete')}</div>
        </div>
      );
      return (
        <eb-list-item
          key={sceneName}
          link="#"
          propsOnPerform={event => this.onPerformItem(event, item, sceneName)}
          swipeout
        >
          <div slot="title">{item.titleLocale}</div>
          <eb-context-menu>
            <div slot="right">{domActions}</div>
          </eb-context-menu>
        </eb-list-item>
      );
    },

    _renderList() {
      if (!this.ready) return;
      const children = [];
      for (const sceneName in this.items) {
        const item = this.items[sceneName];
        children.push(this._renderItem(item, sceneName));
      }
      return <f7-list>{children}</f7-list>;
    },
  },
  render() {
    return (
      <eb-page>
        <eb-navbar large largeTransparent title={this.$text('Mail Management')} eb-back-link="Back">
          <f7-nav-right>
            <eb-link
              ref="buttonAdd"
              iconF7="::add"
              tooltip={this.$text('ActionAddMailScene')}
              propsOnPerform={this.onPerformItemSceneAdd}
            ></eb-link>
          </f7-nav-right>
        </eb-navbar>
        {this._renderList()}
      </eb-page>
    );
  },
};
