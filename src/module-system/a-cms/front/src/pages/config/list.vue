<template>
  <eb-page>
    <eb-navbar :title="$text('cms')" eb-back-link="Back"> </eb-navbar>
    <f7-list>
      <eb-list-item :title="$text('Site')" eb-href="config/site"></eb-list-item>
      <f7-list-group>
        <f7-list-item :title="$text('Languages')" group-title></f7-list-item>
        <eb-list-item v-for="item of languages" :title="item" eb-href="config/language?language=${item}"></eb-list-item>
      </f7-list-group>
    </f7-list>
  </eb-page>
</template>
<script>
import Vue from 'vue';
export default {
  data() {
    return {};
  },
  computed: {
    configSiteBase() {
      return this.$local.state.configSite;
    },
    configSite() {
      return this.$local.state.configSite;
    },
    languages() {
      if (!this.configSiteBase || !this.configSite) return [];
      const site = this.$utils.extend({}, this.configSiteBase, this.configSite);
      return site.language.items.split(',');
    },
  },
  created() {
    this.$local.dispatch('getConfigSiteBase');
    this.$local.dispatch('getConfigSite');
  },
  methods: {},
};

</script>
