import Vue from 'vue';
const ebModules = Vue.prototype.$meta.module.get('a-base').options.mixins.ebModules;
export default {
  mixins: [ebModules],
  data() {
    return {
      items: null,
      itemsGroups: null,
      providers: null,
      providersMap: null,
    };
  },
  computed: {
    ready() {
      return this.modulesAll && this.items && this.providers;
    },
    user() {
      return this.$store.state.auth.user;
    },
  },
  created() {
    this.load();
  },
  methods: {
    async load() {
      // items
      this.items = await this.$api.post('user/authentications');
      // providers
      const action = {
        actionModule: 'a-login',
        actionComponent: 'ebAuthProviders',
        name: 'loadAuthProviders',
      };
      this.providers = await this.$meta.util.performAction({ ctx: this, action, item: { state: 'associate' } });
      this.providersMap = {};
      for (const item of this.providers) {
        const key = `${item.provider.module}:${item.provider.providerName}`;
        this.providersMap[key] = item;
      }
      console.log(this.providers);
    },
    onPerformDisable(event, item) {
      return this.$view.dialog.confirm().then(() => {
        return this.$api.post('user/authenticationDisable', { authId: item.authId }).then(() => {
          // update
          const index = this.items.findIndex(_item => _item.providerId === item.providerId);
          item.authId = null;
          Vue.set(this.items, index, item);
          return true;
        });
      });
    },
    async onPerformEnable(event, item) {
      if (!this.providersMap) return;
      // confirm
      await this.$view.dialog.confirm();
      // provider
      const key = `${item.module}:${item.providerName}`;
      const provider = this.providersMap[key];
      // login
      const login = provider.component.meta.login({
        ctx: this,
        state: 'associate',
        hash: '/a/user/user/authentications',
      });
      await this.$meta.util.wrapPromise(login);
    },
    async onPerformItemEnable(event, item, sceneName) {},
    async onPerformItemDisable(event, item, sceneName) {},
    checkIfCurrent(item, sceneName) {
      return this.user.provider.id === item.scenes[sceneName].__authId;
    },
    checkIfValid(item, sceneName) {
      return item.scenes[sceneName].__authId;
    },
    checkIfEnable(item, sceneName) {
      const fullName = this.getItemFullName(item);
      const provider = this.providersMap[fullName];
      return !item.scenes[sceneName].__authId && provider && provider.provider.scenes[sceneName];
    },
    checkIfDisable(item, sceneName) {
      return item.scenes[sceneName].__authId && !this.checkIfCurrent(item, sceneName);
    },
    async onPerformMigrate() {
      // confirm
      await this.$view.dialog.confirm();
      // open login
      this.$meta.vueLayout.openLogin({
        query: { state: 'migrate' },
        url: '/a/user/user/authentications',
      });
    },
    getItemTitle(item) {
      const meta = item.meta;
      return meta.titleLocale;
    },
    getItemFullName(item) {
      return `${item.module}:${item.providerName}`;
    },
    _renderItemDirect(item) {
      const fullName = this.getItemFullName(item);
      const meta = item.meta;
      //
      let domMedia;
      if (!meta.scene) {
        if (this.checkIfValid(item, 'default')) {
          domMedia = <f7-icon f7="::done"></f7-icon>;
        }
      }
      //
      let domAfter;
      if (!meta.scene) {
        if (this.checkIfEnable(item, 'default')) {
          domAfter = (
            <eb-link propsOnPerform={event => this.onPerformItemEnable(event, item, 'default')}>
              {this.$text('Enable')}
            </eb-link>
          );
        } else if (this.checkIfDisable(item, 'default')) {
          domAfter = (
            <eb-link propsOnPerform={event => this.onPerformItemDisable(event, item, 'default')}>
              {this.$text('Disable')}
            </eb-link>
          );
        } else if (this.checkIfCurrent(item, 'default')) {
          domAfter = <span>{this.$text('Current')}</span>;
        }
      }
      return (
        <eb-list-item key={fullName} link={false}>
          <div slot="title">{this.getItemTitle(item)}</div>
          <div slot="media">{domMedia}</div>
          <div slot="after">{domAfter}</div>
        </eb-list-item>
      );
    },
    _renderItemScene(item, scene, sceneName) {
      //
      let domMedia;
      if (this.checkIfValid(item, sceneName)) {
        domMedia = <f7-icon f7="::done"></f7-icon>;
      }
      //
      let domAfter;
      if (this.checkIfEnable(item, sceneName)) {
        domAfter = (
          <eb-link propsOnPerform={event => this.onPerformItemEnable(event, item, sceneName)}>
            {this.$text('Enable')}
          </eb-link>
        );
      } else if (this.checkIfDisable(item, sceneName)) {
        domAfter = (
          <eb-link propsOnPerform={event => this.onPerformItemDisable(event, item, sceneName)}>
            {this.$text('Disable')}
          </eb-link>
        );
      } else if (this.checkIfCurrent(item, sceneName)) {
        domAfter = <span>{this.$text('Current')}</span>;
      }
      return (
        <eb-list-item key={sceneName} link={false}>
          <div slot="title">{scene.titleLocale}</div>
          <div slot="media">{domMedia}</div>
          <div slot="after">{domAfter}</div>
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
    _renderList() {
      if (!this.ready) return;
      let children = [];
      for (const item of this.items) {
        const domItem = this._renderItem(item);
        if (Array.isArray(domItem)) {
          children = children.concat(domItem);
        } else {
          children.push(domItem);
        }
      }
      return (
        <f7-list form inline-labels no-hairlines-md>
          <f7-list-group>{children}</f7-list-group>
        </f7-list>
      );
    },
    _renderBlockMigrate() {
      if (!this.ready) return;
      return (
        <f7-block>
          <eb-button fill propsOnPerform={this.onPerformMigrate}>
            {this.$text('MigrateToAnotherAccount')}
          </eb-button>
        </f7-block>
      );
    },
  },
  render() {
    return (
      <eb-page>
        <eb-navbar large largeTransparent title={this.$text('Authentications')} eb-back-link="Back"></eb-navbar>
        {this._renderList()}
        {this._renderBlockMigrate()}
      </eb-page>
    );
  },
};
