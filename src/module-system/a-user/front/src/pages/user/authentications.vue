<template>
  <eb-page>
    <eb-navbar :title="$text('Authentications')" eb-back-link="Back"></eb-navbar>
    <f7-list v-if="ready">
      <eb-list-item v-for="item of items" :key="item.id" :title="getModule(item.module).titleLocale">
        <div slot="after">
          <f7-badge v-if="item.authId">{{$text('Enabled')}}</f7-badge>
          <eb-link v-if="item.authId" :context="item" :onPerform="onPerformEnable">{{$text('Enable')}}</eb-link>
          <eb-link v-if="item.authId" :context="item" :onPerform="onPerformDisable">{{$text('Disable')}}</eb-link>
        </div>
      </eb-list-item>
    </f7-list>
  </eb-page>
</template>
<script>
import Vue from 'vue';
const ebModules = Vue.prototype.$meta.module.get('a-base').options.components.ebModules;
export default {
  mixins: [ ebModules ],
  data() {
    return {
      items: null,
    };
  },
  computed: {
    ready() {
      return this.modulesAll && this.items;
    },
  },
  created() {
    // fetch
    return this.$api.post('user/authentications').then(data => {
      this.items = data;
    });
  },
  methods: {
    onPerformDisable(event, item) {
      return this.$view.dialog.confirm().then(() => {
        return this.$api.post('user/authenticationDisable', { authId: item.authId }).then(() => {
          item.authId = null;
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
  },
};

</script>
