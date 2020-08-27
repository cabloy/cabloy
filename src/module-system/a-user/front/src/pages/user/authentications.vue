<template>
  <eb-page>
    <eb-navbar large largeTransparent :title="$text('Authentications')" eb-back-link="Back"></eb-navbar>
    <f7-list v-if="ready">
      <eb-list-item v-for="item of items" :key="item.providerId" :title="authTitle(item)">
        <div slot="after">
          <f7-badge v-if="item.authId">{{$text('Enabled')}}</f7-badge>
          <eb-link v-if="checkIfEnable(item)" :context="item" :onPerform="onPerformEnable">{{$text('Enable')}}</eb-link>
          <eb-link v-if="checkIfDisable(item)" :context="item" :onPerform="onPerformDisable">{{$text('Disable')}}</eb-link>
        </div>
      </eb-list-item>
    </f7-list>
  </eb-page>
</template>
<script>
import Vue from 'vue';
const ebModules = Vue.prototype.$meta.module.get('a-base').options.mixins.ebModules;
export default {
  mixins: [ebModules],
  data() {
    return {
      items: null,
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
    // items
    this.$api.post('user/authentications').then(data => {
      this.items = data;
    });
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
  methods: {
    isProviderCurrent(item) {
      return this.user.provider.providerId === item.providerId;
    },
    authTitle(item) {
      let title = item.meta.titleLocale;
      if (this.isProviderCurrent(item)) {
        title = `${title} ⭐`;
      }
      return title;
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
      // confirm
      await this.$view.dialog.confirm();
      // provider
      const key = `${item.module}:${item.providerName}`;
      const provider = this.providersMap[key];
      // login
      const login = provider.component.meta.login({ ctx: this, state: 'associate', hash: '/a/user/user/authentications' });
      await this.$meta.util.wrapPromise(login);
    },
    checkIfEnable(item) {
      const key = `${item.module}:${item.providerName}`;
      return !item.authId && !!this.providersMap[key];
    },
    checkIfDisable(item) {
      return item.authId && !this.isProviderCurrent(item);
    },
  },
};

</script>
