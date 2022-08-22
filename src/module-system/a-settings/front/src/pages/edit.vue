<template>
  <eb-page>
    <eb-navbar large largeTransparent :title="page_title" eb-back-link="Back">
      <f7-nav-right>
        <eb-link v-if="ready" ref="buttonSubmit" iconF7="::save" :onPerform="onPerformSave"></eb-link>
      </f7-nav-right>
    </eb-navbar>
    <eb-validate
      ref="validate"
      auto
      :data="data"
      :params="validateParams"
      :onPerform="onPerformValidate"
      @submit="onFormSubmit"
      @validateItem:change="onValidateItemChange"
    ></eb-validate>
  </eb-page>
</template>
<script>
import Vue from 'vue';
const ebModules = Vue.prototype.$meta.module.get('a-base').options.mixins.ebModules;
const ebPageDirty = Vue.prototype.$meta.module.get('a-components').options.mixins.ebPageDirty;
export default {
  mixins: [ebModules, ebPageDirty],
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
    page_title() {
      let title = '';
      const module = this.getModule(this.module);
      if (module) {
        title = module.titleLocale;
      }
      return this.page_getDirtyTitle(title);
    },
  },
  created() {
    this._load();
  },
  methods: {
    async _load() {
      try {
        const data = await this.$api.post(`settings/${this.scene}/load`, {
          module: this.module,
        });
        this.data = data.data;
        this.validateParams = {
          module: data.module,
          validator: data.validator,
        };
      } catch (err) {
        this.$view.toast.show({ text: err.message });
      }
    },
    onFormSubmit() {
      this.$refs.buttonSubmit.onClick();
    },
    async onPerformValidate() {
      await this.$api.post(`settings/${this.scene}/save`, {
        module: this.module,
        data: this.data,
      });
      this.page_setDirty(false);
      return true; // toast on success
    },
    onPerformSave(event) {
      return this.$refs.validate.perform(event);
    },
    onValidateItemChange() {
      this.page_setDirty(true);
    },
  },
};
</script>
