<template>
  <eb-page>
    <eb-navbar large largeTransparent :title="$text('Instance')" eb-back-link="Back">
      <f7-nav-right>
        <eb-link iconMaterial="save" ref="buttonSubmit" :onPerform="onPerformSave"></eb-link>
        <eb-link iconMaterial="visibility" :onPerform="onPerformPreview"></eb-link>
      </f7-nav-right>
    </eb-navbar>
    <eb-validate v-if="instance" ref="validate" :auto="false" :params="{validator: 'instance'}" :onPerform="onPerformValidate">
      <eb-list form no-hairlines-md @submit.prevent="onSubmit">
        <eb-list-input type="text" disabled :value="instance.name || $text('Empty')" dataPath="name" :label="$text('Subdomain')" :placeholder="$text('Subdomain')" floating-label></eb-list-input>
        <eb-list-input type="text" v-model="instance.title" dataPath="title" :label="$text('Title')" :placeholder="$text('Title')" floating-label clear-button></eb-list-input>
        <eb-list-input type="textarea" :input="false" v-model="instance.config" dataPath="config" :label="$text('Config')" :placeholder="$text('Config')">
          <textarea slot="input" type="textarea" v-model="instance.config" class="json-textarea config-edit"></textarea>
        </eb-list-input>
      </eb-list>
    </eb-validate>
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
      data.config = JSON.stringify(JSON.parse(data.config || '{}'), null, 2);
      this.instance = data;
    });
  },
  methods: {
    onPerformValidate() {
      return this.$api.post('instance/save', {
        data: this.instance,
      }).then(() => {
        // change preview
        this.$emit('preview');
        // instance
        this.$store.commit('auth/setInstance', { name: this.instance.name, title: this.instance.title });
        // title
        window.document.title = this.$store.getters['auth/title'];
        // ok
        return true;
      });
    },
    onPerformSave() {
      return this.$refs.validate.perform();
    },
    onPerformPreview() {
      this.$view.navigate('/a/instance/instance/configPreview', {
        context: {
          params: {
            source: this,
          },
        },
      });
    },
    onSubmit() {
      this.$refs.buttonSubmit.onClick();
    },
  },
};

</script>
<style lang="less" scoped>
.config-edit {
  width: 100%;
  height: 400px;
  margin: 8px 0 0 0;
  padding: 6px;
}

</style>
