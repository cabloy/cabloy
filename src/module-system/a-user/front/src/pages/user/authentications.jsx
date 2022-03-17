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
      return this.modulesAll && this.items;
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
      this.groupItems();
      // providers
      const action = {
        actionModule: 'a-login',
        actionComponent: 'ebAuthProviders',
        name: 'loadAuthProviders',
      };
      this.$meta.util.performAction({ ctx: this, action, item: { state: 'associate' } }).then(res => {
        this.providers = res;
        this.providersMap = {};
        for (const item of this.providers) {
          const key = `${item.provider.module}:${item.provider.providerName}`;
          this.providersMap[key] = item;
        }
      });
    },
    groupItems() {
      this.itemsGroups = [
        { id: 'enabled', title: this.$text('Enabled'), items: [] },
        { id: 'others', title: this.$text('Others'), items: [] },
      ];
      for (const item of this.items) {
        if (item.authId) {
          this.itemsGroups[0].items.push(item);
        } else {
          this.itemsGroups[1].items.push(item);
        }
      }
    },
    isProviderCurrent(item) {
      return this.user.provider.providerId === item.providerId;
    },
    onPerformDisable(event, item) {
      return this.$view.dialog.confirm().then(() => {
        return this.$api.post('user/authenticationDisable', { authId: item.authId }).then(() => {
          // update
          const index = this.items.findIndex(_item => _item.providerId === item.providerId);
          item.authId = null;
          Vue.set(this.items, index, item);
          this.groupItems();
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
    checkIfEnable(item) {
      if (!this.providersMap) return false;
      const key = `${item.module}:${item.providerName}`;
      return !item.authId && !!this.providersMap[key];
    },
    checkIfDisable(item) {
      return item.authId && !this.isProviderCurrent(item);
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
    _renderList() {
      if (!this.ready) return;
      return <f7-list form inline-labels no-hairlines-md></f7-list>;
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
