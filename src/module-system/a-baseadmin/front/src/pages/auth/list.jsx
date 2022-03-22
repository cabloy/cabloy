import Vue from 'vue';
const ebModules = Vue.prototype.$meta.module.get('a-base').options.mixins.ebModules;
export default {
  mixins: [ebModules],
  data() {
    return {
      items: null,
      itemsGroups: null,
    };
  },
  computed: {
    ready() {
      return this.modulesAll && this.items;
    },
  },
  created() {
    this.load();
  },
  methods: {
    async load() {
      // fetch
      this.items = await this.$api.post('auth/list');
      this.groupItems();
    },
    groupItems() {
      this.itemsGroups = [
        { id: 'enabled', title: this.$text('Enabled'), items: [] },
        { id: 'disabled', title: this.$text('Disabled'), items: [] },
      ];
      for (const item of this.items) {
        if (item.providerItem.disabled) {
          this.itemsGroups[1].items.push(item);
        } else {
          this.itemsGroups[0].items.push(item);
        }
      }
    },
    getItemLink(item, sceneName) {
      const meta = item.meta;
      let validator;
      if (!sceneName) {
        // for item
        validator = meta.scene ? null : meta.validator;
      } else {
        // for scene
        const metaScene = this._getMetaScene(item, sceneName);
        validator = metaScene.validator;
      }
      return validator ? '#' : false;
    },
    getItemFullName(item) {
      return `${item.module}:${item.providerName}`;
    },
    onPerformItem(event, item) {
      if (!this.getItemLink(item)) return;
      this._editSceneConfig(item, 'default');
    },
    onPerformItemScene(event, item, sceneName) {
      if (!this.getItemLink(item, sceneName)) return;
      this._editSceneConfig(item, sceneName);
    },
    onPerformItemDisable(event, item) {
      return this.onItemDisable(event, item, 1);
    },
    onPerformItemEnable(event, item) {
      return this.onItemDisable(event, item, 0);
    },
    async onItemDisable(event, item, disabled) {
      await this.$api.post('auth/disable', { id: item.providerItem.id, disabled });
      const index = this.items.findIndex(_item => _item.providerItem.id === item.providerItem.id);
      this.items[index].providerItem.disabled = disabled;
      this.groupItems();
      this.$meta.util.swipeoutClose(event.currentTarget);
      return true;
    },
    onPerformItemSceneDisable(event, item, sceneName) {
      return this.onItemSceneDisable(event, item, sceneName, 1);
    },
    onPerformItemSceneEnable(event, item, sceneName) {
      return this.onItemSceneDisable(event, item, sceneName, 0);
    },
    async onItemSceneDisable(event, item, sceneName, disabled) {
      await this.$api.post('authScene/disable', { id: item.providerItem.id, sceneName, disabled });
      const index = this.items.findIndex(_item => _item.providerItem.id === item.providerItem.id);
      this.$set(this.items[index].scenes[sceneName], 'disabled', disabled);
      this.$meta.util.swipeoutClose(event.currentTarget);
      return true;
    },
    async onPerformItemSceneAdd(event, item) {
      // sceneName
      const sceneName = await this.$view.dialog.prompt(this.$text('Please specify the scene name'));
      if (!sceneName || item.scenes[sceneName]) return;
      // add
      const title = sceneName.replace(sceneName[0], sceneName[0].toUpperCase());
      await this.$api.post('authScene/add', {
        id: item.providerItem.id,
        sceneName,
        data: {
          title,
        },
      });
      // set
      this.$set(item.scenes, sceneName, {
        title,
        titleLocale: title,
      });
    },
    async onPerformItemSceneDelete(event, item, sceneName) {
      await this.$view.dialog.confirm();
      // delete
      await this.$api.post('authScene/delete', {
        id: item.providerItem.id,
        sceneName,
      });
      // delete
      this.$delete(item.scenes, sceneName);
    },
    _getMetaScene(item, sceneName) {
      const meta = item.meta;
      if (meta.scene) {
        const scene = item.metaScenes && item.metaScenes[sceneName];
        return (scene && scene.meta) || meta;
      }
      return meta;
    },
    _editSceneConfig(item, sceneName) {
      const metaScene = this._getMetaScene(item, sceneName);
      // json
      if (metaScene.validator.validator === 'json') {
        return this._editSceneConfig_json(item, sceneName);
      }
      // schema
      this._editSceneConfig_schema(item, sceneName);
    },
    _editSceneConfig_getTitle(item, sceneName) {
      const meta = item.meta;
      let title = this.$text('Config');
      if (meta.scene) {
        title = `${title}: ${sceneName}`;
      }
      return title;
    },
    async _editSceneConfig_save(item, sceneName, data) {
      // save
      const res = await this.$api.post('authScene/save', {
        id: item.providerItem.id,
        sceneName,
        data,
      });
      // change
      const sceneOld = item.scenes[sceneName];
      const sceneNew = res.data;
      item.scenes[sceneName] = {
        ...sceneOld,
        ...sceneNew,
      };
      if (sceneOld.title !== sceneNew.title) {
        item.scenes[sceneName].titleLocale = sceneNew.title;
      }
    },
    _editSceneConfig_json(item, sceneName) {
      const data = this.$meta.util.extend({}, item.scenes[sceneName]);
      // navigate
      this.$view.navigate(`/a/jsoneditor/json/editor?t=${Date.now()}`, {
        context: {
          params: {
            value: data,
            valueType: 'json',
            title: this._editSceneConfig_getTitle(item, sceneName),
            readOnly: false,
            actionSave: false,
            actionDone: true,
          },
          callback: (code, value) => {
            if (code === 200) {
              this._editSceneConfig_save(item, sceneName, value);
            }
          },
        },
      });
    },
    _editSceneConfig_schema(item, sceneName) {
      this.$view.navigate(
        `/a/baseadmin/auth/config?module=${item.module}&providerName=${item.providerName}&sceneName=${sceneName}`,
        {
          context: {
            params: {
              item,
              title: this._editSceneConfig_getTitle(item, sceneName),
              onSaveScene: async data => {
                await this._editSceneConfig_save(item, sceneName, data);
              },
            },
          },
        }
      );
    },
    _renderItemDirect(item) {
      const fullName = this.getItemFullName(item);
      const meta = item.meta;
      let domAction;
      if (item.providerItem.disabled) {
        domAction = (
          <div color="orange" propsOnPerform={event => this.onPerformItemEnable(event, item)}>
            <f7-icon slot="media" f7="::play-arrow"></f7-icon>
            <div slot="title">{this.$text('Enable')}</div>
          </div>
        );
      } else {
        domAction = (
          <div color="red" propsOnPerform={event => this.onPerformItemDisable(event, item)}>
            <f7-icon slot="media" f7="::stop"></f7-icon>
            <div slot="title">{this.$text('Disable')}</div>
          </div>
        );
      }
      let domAfter;
      if (meta.scene) {
        domAfter = <eb-link iconF7="::add" propsOnPerform={event => this.onPerformItemSceneAdd(event, item)}></eb-link>;
      }
      let domIcon;
      if (meta.icon) {
        domIcon = <f7-icon f7={meta.icon.f7} material={meta.icon.material}></f7-icon>;
      }
      return (
        <eb-list-item
          key={fullName}
          link={this.getItemLink(item)}
          propsOnPerform={event => this.onPerformItem(event, item)}
          swipeout
        >
          <div slot="title">{item.meta.titleLocale}</div>
          <div slot="after">{domAfter}</div>
          <div slot="media">{domIcon}</div>
          <eb-context-menu>
            <div slot="right">{domAction}</div>
          </eb-context-menu>
        </eb-list-item>
      );
    },
    _renderItemScene(item, scene, sceneName) {
      // actions
      const domActions = [];
      if (scene.disabled) {
        domActions.push(
          <div
            key="actionEnable"
            color="orange"
            propsOnPerform={event => this.onPerformItemSceneEnable(event, item, sceneName)}
          >
            <f7-icon slot="media" f7="::play-arrow"></f7-icon>
            <div slot="title">{this.$text('Enable')}</div>
          </div>
        );
      } else {
        domActions.push(
          <div
            key="actionDisable"
            color="red"
            propsOnPerform={event => this.onPerformItemSceneDisable(event, item, sceneName)}
          >
            <f7-icon slot="media" f7="::stop"></f7-icon>
            <div slot="title">{this.$text('Disable')}</div>
          </div>
        );
      }
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
      // after
      let domAfter;
      if (scene.disabled) {
        domAfter = <f7-badge>{this.$text('Disabled')}</f7-badge>;
      }
      // icon
      const domIcon = <f7-icon color="gray" f7="::dot"></f7-icon>;
      return (
        <eb-list-item
          key={sceneName}
          link={this.getItemLink(item, sceneName)}
          propsOnPerform={event => this.onPerformItemScene(event, item, sceneName)}
          swipeout
        >
          <div slot="title">{scene.titleLocale}</div>
          <div slot="after">{domAfter}</div>
          <div slot="media">{domIcon}</div>
          <eb-context-menu>
            <div slot="right">{domActions}</div>
          </eb-context-menu>
        </eb-list-item>
      );
    },
    _renderItem(item) {
      const fullName = this.getItemFullName(item);
      const meta = item.meta;
      const domItemDirect = this._renderItemDirect(item);
      // scene: false
      if (!meta.scene) {
        return domItemDirect;
      }
      // scene: true
      const childrenScenes = [];
      for (const sceneName in item.scenes) {
        const scene = item.scenes[sceneName];
        childrenScenes.push(this._renderItemScene(item, scene, sceneName));
      }
      const children = [domItemDirect];
      children.push(<f7-list-group key={fullName + ':scenes'}>{childrenScenes}</f7-list-group>);
      return children;
    },
    _renderGroup(group) {
      let children = [];
      children.push(<f7-list-item group-title title={`${group.title} (${group.items.length})`}></f7-list-item>);
      for (const item of group.items) {
        const domItem = this._renderItem(item);
        if (Array.isArray(domItem)) {
          children = children.concat(domItem);
        } else {
          children.push(domItem);
        }
      }
      return <f7-list-group key={group.id}>{children}</f7-list-group>;
    },
    _renderList() {
      if (!this.ready) return;
      const children = [];
      for (const group of this.itemsGroups) {
        children.push(this._renderGroup(group));
      }
      return (
        <f7-list form inline-labels no-hairlines-md>
          {children}
        </f7-list>
      );
    },
  },
  render() {
    return (
      <eb-page>
        <eb-navbar large largeTransparent title={this.$text('Auth Management')} eb-back-link="Back"></eb-navbar>
        {this._renderList()}
      </eb-page>
    );
  },
};
