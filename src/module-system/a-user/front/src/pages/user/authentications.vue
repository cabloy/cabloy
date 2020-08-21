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
    // fetch
    return this.$api.post('user/authentications').then(data => {
      this.items = data;
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
    onPerformEnable(event, item) {
      return this.$view.dialog.confirm().then(() => {
        const module = this.getModule(item.module);
        const info = module.info;
        const url = `/api/${info.url}/passport/${info.relativeName}/${item.providerName}?state=associate`;
        this.$meta.vueApp.toLogin({ url, hash: '/a/user/user/authentications' });
      });
    },
    checkIfEnable(item) {
      return !item.authId && !item.meta.disableAssociate &&
        (!ctx.$meta.config.base.jwt);
      //(!ctx.$meta.config.base.jwt || item.meta.mode !== 'redirect');
    },
    checkIfDisable(item) {
      return item.authId && !this.isProviderCurrent(item);
    },
  },
};

</script>
