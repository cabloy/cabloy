<template>
  <eb-list form no-hairlines-md @submit="onSubmit">
    <eb-list-item-validate dataKey="language" :meta="{options:languages}" @change="onChangeLanguage"></eb-list-item-validate>
    <eb-list-item-choose link="#" dataPath="categoryId" :title="$text('Category')" :onChoose="onChooseCategory">
      <div slot="after">{{data.categoryName}}</div>
    </eb-list-item-choose>
    <eb-list-item-validate dataKey="content"></eb-list-item-validate>
  </eb-list>
</template>
<script>
import utils from '../../common/utils.js';
export default {
  meta: {
    global: false,
  },
  props: {
    data: {
      type: Object,
    },
  },
  data() {
    const atomClass = { module: 'a-cms', atomClassName: 'article' };
    return {
      atomClass,
    };
  },
  computed: {
    languages() {
      return this.$local.state.languages[this.atomClass.module];
    },
  },
  created() {
    this.$local.dispatch('getLanguages', {
      atomClass: this.atomClass,
    });
  },
  methods: {
    onSubmit(event) {
      this.$emit('submit', event);
    },
    combineAtomClass(url) {
      return utils.combineAtomClass(this.atomClass, url);
    },
    onChangeLanguage() {
      this.$set(this.data, 'categoryId', null);
      this.$set(this.data, 'categoryName', null);
    },
    onChooseCategory() {
      if (!this.data.language) {
        this.$view.dialog.alert(this.$text('Please specify the language'));
        return false;
      }
      return new Promise(resolve => {
        const url = this.combineAtomClass('/a/cms/category/select');
        this.$view.navigate(url, {
          context: {
            params: {
              language: this.data.language,
              categoryIdStart: 0,
              leafOnly: true,
            },
            callback: (code, data) => {
              if (code === 200) {
                this.$set(this.data, 'categoryId', data.id);
                this.$set(this.data, 'categoryName', data.categoryName);
                resolve(true);
              } else if (code === false) {
                resolve(false);
              }
            },
          },
        });
      });
    },
  },
};

</script>
<style scoped>
</style>
