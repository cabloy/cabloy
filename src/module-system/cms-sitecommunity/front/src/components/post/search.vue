<template>
  <f7-list v-if="moduleCMS">
    <eb-list-item-validate dataKey="language" :meta="{options:languages}" @change="onChangeLanguage"></eb-list-item-validate>
    <eb-list-item-choose link="#" dataPath="categoryId" :title="$text('Category')" :onChoose="onChooseCategory">
      <div slot="after">{{data.categoryName}}</div>
    </eb-list-item-choose>
    <eb-list-item-validate dataKey="content"></eb-list-item-validate>
  </f7-list>
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
    const atomClass = { module: 'cms-sitecommunity', atomClassName: 'post' };
    return {
      atomClass,
      moduleCMS: null,
    };
  },
  computed: {
    languages() {
      const stateLanguages = this.$store.getState('a/cms/languages');
      return stateLanguages[this.atomClass.module];
    },
  },
  created() {
    // load module:cms
    this.$meta.module.use('a-cms', module => {
      // languages
      this.$store.dispatch('a/cms/getLanguages', {
        atomClass: this.atomClass,
      }).then(() => {
        this.moduleCMS = module;
      });
    });
  },
  methods: {
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
