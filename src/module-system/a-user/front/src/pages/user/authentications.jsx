import Vue from 'vue';
const ebModules = Vue.prototype.$meta.module.get('a-base').options.mixins.ebModules;
export default {
  mixins: [ebModules],
  data() {
    return {
      items: null,
      itemsGroups: null,
      providersLogin: null,
      providersLoginMap: null,
    };
  },
  computed: {
    ready() {
      return this.modulesAll && this.items && this.providersLogin;
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
      // providers login
      const useStoreAuthProviders = await this.$store.use('a/login/authProviders');
      this.providersLogin = await useStoreAuthProviders.loadAuthProviders({ ctx: this, state: 'associate' });
      this.providersLoginMap = {};
      for (const providerLogin of this.providersLogin) {
        const key = `${providerLogin.module}:${providerLogin.providerName}`;
        this.providersLoginMap[key] = providerLogin;
      }
    },
    _getMetaScene(item, sceneName) {
      const meta = item.meta;
      if (meta.scene) {
        const scene = item.metaScenes && item.metaScenes[sceneName];
        return (scene && scene.meta) || meta;
      }
      return meta;
    },
    async onPerformItemEnable(event, item, sceneName) {
      // confirm
      await this.$view.dialog.confirm();
      // provider
      const fullName = this.getItemFullName(item);
      const providerLogin = this.providersLoginMap[fullName];
      // login
      const componentLogin = providerLogin.renderComponents[sceneName || 'default'];
      const options = {
        propsData: {
          ctxCaller: this,
          state: 'associate',
          provider: providerLogin,
          providerModule: providerLogin.module,
          providerName: providerLogin.providerName,
          providerScene: providerLogin.meta.scene ? sceneName : null,
        },
      };
      const componentInstance = this.$meta.util.createComponentInstance(componentLogin, options);
      await componentInstance.login({
        hash: '/a/user/user/authentications',
      });
    },
    async onPerformItemDisable(event, item, sceneName) {
      const authId = this.getAuthId(item, sceneName);
      await this.$view.dialog.confirm();
      await this.$api.post('user/authenticationDisable', { authId });
      this.clearAuthId(item, sceneName);
      return true;
    },
    checkIfCurrent(item, sceneName = 'default') {
      return this.user.provider.id === this.getAuthId(item, sceneName);
    },
    checkIfValid(item, sceneName = 'default') {
      return !!this.getAuthId(item, sceneName);
    },
    checkIfEnable(item, sceneName = 'default') {
      const fullName = this.getItemFullName(item);
      const providerLogin = this.providersLoginMap[fullName];
      return !this.getAuthId(item, sceneName) && providerLogin && providerLogin.scenes[sceneName];
    },
    checkIfDisable(item, sceneName = 'default') {
      return !!this.getAuthId(item, sceneName) && !this.checkIfCurrent(item, sceneName);
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
    getAuthId(item, sceneName = 'default') {
      return item.scenes[sceneName].__authId;
    },
    clearAuthId(item, sceneName = 'default') {
      this.$delete(item.scenes[sceneName], '__authId');
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
        if (this.checkIfValid(item)) {
          domMedia = <f7-icon color="green" f7="::done"></f7-icon>;
        }
      }
      if (!domMedia && meta.icon) {
        domMedia = <f7-icon f7={meta.icon.f7} material={meta.icon.material}></f7-icon>;
      }
      //
      let domAfter;
      if (!meta.scene) {
        if (this.checkIfEnable(item)) {
          domAfter = (
            <eb-link propsOnPerform={event => this.onPerformItemEnable(event, item)}>{this.$text('Enable')}</eb-link>
          );
        } else if (this.checkIfDisable(item)) {
          domAfter = (
            <eb-link propsOnPerform={event => this.onPerformItemDisable(event, item)}>{this.$text('Disable')}</eb-link>
          );
        } else if (this.checkIfCurrent(item)) {
          domAfter = <f7-badge>{this.$text('Current')}</f7-badge>;
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
        domMedia = <f7-icon color="green" f7="::done"></f7-icon>;
      }
      if (!domMedia) {
        domMedia = <f7-icon color="gray" f7="::dot"></f7-icon>;
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
        domAfter = <f7-badge>{this.$text('Current')}</f7-badge>;
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
