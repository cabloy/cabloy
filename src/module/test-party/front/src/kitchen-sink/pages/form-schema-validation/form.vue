<template>
  <eb-page>
    <eb-navbar large largeTransparent :title="$text('Form (Simple)')" eb-back-link="Back">
      <f7-nav-right>
        <eb-link ref="buttonSubmit" iconMaterial="save" :onPerform="onPerformSave"></eb-link>
      </f7-nav-right>
    </eb-navbar>
    <f7-block-title>Form</f7-block-title>
    <eb-list v-if="item" form no-hairlines-md @submit.prevent="onFormSubmit">
      <eb-list-input :label="$text('Username')" floating-label type="text" clear-button :placeholder="$text('Username')" v-model="item.userName"></eb-list-input>
      <eb-list-input :label="$text('Password')" floating-label type="password" clear-button :placeholder="$text('Password')" v-model="item.password"></eb-list-input>
      <eb-list-input :label="$text('Password Again')" floating-label type="Password" clear-button :placeholder="$text('Password Again')" v-model="item.passwordAgain"></eb-list-input>
      <f7-list-item smartSelect :title="$text('Sex')" :smartSelectParams="{openIn: 'page', closeOnSelect: true}">
        <eb-select name="sex" v-model="item.sex" optionsBlankAuto :multiple="false" :options="sexes"></eb-select>
      </f7-list-item>
      <f7-list-item smartSelect :title="$text('Language')" :smartSelectParams="{openIn: 'page', closeOnSelect: true}">
        <eb-select name="language" v-model="item.language" optionsBlankAuto :multiple="false" :options="languages"></eb-select>
      </f7-list-item>
      <eb-list-input :label="$text('Avatar')" floatingLabel type="text" clearButton :placeholder="$text('Avatar')" v-model="item.avatar" @focus="onAvatarFocus" @blur="onAvatarBlur">
        <eb-button slot="root-end" class="eb-input-file-upload" :onPerform="onPerformUpload">{{$text('Upload')}}</eb-button>
      </eb-list-input>
      <f7-list-item v-if="item.avatar">
        <img class="avatar avatar48" :src="getAvatarUrl(item.avatar,48)">
      </f7-list-item>
      <f7-list-item>
        <span slot="title">{{$text('Remember Me')}}</span>
        <eb-toggle slot="after" v-model="item.rememberMe"></eb-toggle>
      </f7-list-item>
    </eb-list>
    <f7-block-title>Form Value</f7-block-title>
    <pre class="form-data">{{form2}}</pre>
  </eb-page>
</template>
<script>
export default {
  data() {
    return {
      item: null,
      sexes: [
        { title: this.$text('Male'), value: 1 },
        { title: this.$text('Female'), value: 2 },
      ],
      languages: [
        { title: this.$text('English'), value: 'en-us' },
        { title: this.$text('Chinese'), value: 'zh-cn' },
      ],
    };
  },
  computed: {
    form2() {
      return JSON5.stringify(this.item, null, 2);
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
      return this.$api.post('kitchen-sink/form-schema-validation/saveSimple', {
        data: this.item,
      }).then(() => {
        this.$view.toast.show();
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
    onAvatarFocus(event) {
      const upload = this.$$(event.target).closest('li').find('.eb-input-file-upload');
      const timeoutId = upload.data('timeoutId');
      if (timeoutId) {
        window.clearTimeout(timeoutId);
        upload.data('timeoutId', 0);
      }
      upload.show();
    },
    onAvatarBlur(event) {
      const upload = this.$$(event.target).closest('li').find('.eb-input-file-upload');
      const timeoutId = window.setTimeout(() => {
        upload.data('timeoutId', 0);
        upload.hide();
      }, 300);
      upload.data('timeoutId', timeoutId);
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
