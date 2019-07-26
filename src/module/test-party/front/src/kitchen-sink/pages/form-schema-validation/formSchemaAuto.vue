<template>
  <eb-page>
    <eb-navbar :title="$text('Form / Schema (Auto) / Validation')" eb-back-link="Back">
      <f7-nav-right>
        <eb-link ref="buttonSubmit" iconMaterial="save" :onPerform="onPerformSave"></eb-link>
      </f7-nav-right>
    </eb-navbar>
    <f7-block-title>Form</f7-block-title>
    <eb-validate v-if="item" ref="validate" auto :data="item" :params="validateParams" :onPerform="onPerformValidate" @submit.prevent="onFormSubmit">
    </eb-validate>
    <f7-block-title>Form Value</f7-block-title>
    <pre class="form-data">{{form2}}</pre>
  </eb-page>
</template>
<script>
export default {
  data() {
    return {
      item: null,
      validateParams: {
        module: 'test-party',
        validator: 'formTest',
      },
    };
  },
  computed: {
    form2() {
      return JSON.stringify(this.item, null, 2);
    },
  },
  created() {
    this.$api.get('kitchen-sink/form-schema-validation/load').then(item => {
      this.item = item;
    });
  },
  methods: {
    onFormSubmit() {
      this.$refs.buttonSubmit.onClick();
    },
    onPerformSave() {
      return this.$refs.validate.perform();
    },
    onPerformValidate() {
      return this.$api.post('kitchen-sink/form-schema-validation/saveValidation', {
        data: this.item,
      }).then(() => {
        return true;
      });
    },
    onPerformUpload() {
      this.$view.navigate('/a/file/file/upload', {
        target: '_self',
        context: {
          params: {
            mode: 1, // image
            atomId: 0, // default
          },
          callback: (code, value) => {
            if (code === 200) {
              this.item.avatar = value.downloadUrl;
            }
          },
        },
      });
    },
    getAvatarUrl(avatar, size) {
      return this.$meta.util.combineImageUrl(avatar, size);
    },
  },
};

</script>
<style lang="less" scoped>
.form-data {
  border: solid 1px #ccc;
  margin: 8px;
  padding: 8px;
}

</style>
