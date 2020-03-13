<template>
  <eb-page>
    <eb-navbar large largeTransparent :title="title" eb-back-link="Back">
      <f7-nav-right>
        <eb-link v-if="ready" iconMaterial="save" :onPerform="onSave"></eb-link>
      </f7-nav-right>
    </eb-navbar>
    <eb-validate ref="validate" auto :data="data" :params="validateParams" :onPerform="onPerformValidate">
    </eb-validate>
  </eb-page>
</template>
<script>
import Vue from 'vue';
const ebModules = Vue.prototype.$meta.module.get('a-base').options.mixins.ebModules;
export default {
  mixins: [ebModules],
  data() {
    return {
      scene: this.$f7route.params.scene,
      module: this.$f7route.query.module,
      data: null,
      validateParams: null,
    };
  },
  computed: {
    ready() {
      return this.data && this.validateParams;
    },
    title() {
      const module = this.getModule(this.module);
      return module ? module.titleLocale : '';
    },
  },
  methods: {
    onPerformValidate(event, context) {
      return this.$api.post(`settings/${this.scene}/save`, {
        module: this.module,
        data: this.data,
      }).then(() => {
        return true; // toast on success
      });
    },
    onSave(event) {
      return this.$refs.validate.perform(event, 'save');
    },
  },
  created() {
    this.$api.post(`settings/${this.scene}/load`, {
      module: this.module,
    }).then(data => {
      this.data = data.data;
      this.validateParams = {
        module: data.module,
        validator: data.validator,
      };
    });
  },
};

</script>
<style scoped>
</style>
