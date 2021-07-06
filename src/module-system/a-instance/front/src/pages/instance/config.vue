<template>
  <eb-page>
    <eb-navbar large largeTransparent :title="$text('Instance')" eb-back-link="Back">
      <f7-nav-right>
        <eb-link iconMaterial="save" ref="buttonSubmit" :onPerform="onPerformSave"></eb-link>
      </f7-nav-right>
    </eb-navbar>
    <eb-validate v-if="instance" ref="validate" :auto="true" :data="instance" :params="{ module: 'a-instance', validator: 'instance' }" :onPerform="onPerformValidate" @submit="onSubmit">
    </eb-validate>
    <f7-toolbar bottom-md>
      <eb-link :onPerform="onPerformReload">{{ $text('Reload Instance') }}</eb-link>
    </f7-toolbar>
  </eb-page>
</template>
<script>
export default {
  data() {
    return {
      instance: null,
    };
  },
  created() {
    this.$api.post('instance/item').then(data => {
      data.config = window.JSON5.stringify(JSON.parse(data.config || '{}'), null, 2);
      this.instance = data;
    });
  },
  methods: {
    async onPerformValidate() {
      const data = this.$utils.extend({}, this.instance);
      data.config = JSON.stringify(window.JSON5.parse(data.config || '{}'));
      await this.$api.post('instance/save', { data });
      // instance
      this.$store.commit('auth/setInstance', { name: this.instance.name, title: this.instance.title });
      // title
      window.document.title = this.$store.getters['auth/title'];
      // ok
      return true;
    },
    onPerformSave() {
      return this.$refs.validate.perform();
    },
    onSubmit() {
      this.$refs.buttonSubmit.onClick();
    },
    async onPerformReload() {
      await this.$view.dialog.confirm();
      await this.$api.post('instance/reload');
      return true;
    },
  },
};
</script>
<style lang="less" scoped>
.config-edit {
  width: 100%;
  height: 400px;
}
</style>
