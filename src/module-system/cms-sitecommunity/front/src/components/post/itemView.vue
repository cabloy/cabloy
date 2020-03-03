<template>
  <f7-list v-if="moduleCMS">
    <f7-list-group>
      <f7-list-item group-title :title="$text('Title')"></f7-list-item>
      <eb-list-item-validate dataKey="atomName"></eb-list-item-validate>
    </f7-list-group>
    <f7-list-group>
      <f7-list-item group-title :title="$text('Content')"></f7-list-item>
      <eb-list-item-choose link="#" dataPath="content" :title="$text('Content')" :onChoose="onChooseEditContent">
      </eb-list-item-choose>
    </f7-list-group>
    <f7-list-group>
      <f7-list-item group-title :title="$text('Basic Info')"></f7-list-item>
      <eb-list-item-validate dataKey="language" :meta="{options:languages}"></eb-list-item-validate>
      <f7-list-item :title="$text('Category')">
        <div slot="after">{{item.categoryName}}</div>
      </f7-list-item>
      <f7-list-item :title="$text('Tags')">
        <div slot="after">{{adjustTags(item.tags)}}</div>
      </f7-list-item>
    </f7-list-group>
  </f7-list>
</template>
<script>
import utils from '../../common/utils.js';
export default {
  props: {
    readOnly: {
      type: Boolean,
    },
    item: {
      type: Object,
    },
  },
  data() {
    return {
      moduleCMS: null,
    };
  },
  computed: {
    atomClass() {
      return {
        module: this.item.module,
        atomClassName: this.item.atomClassName,
      };
    },
    languages() {
      const stateLanguages = this.$store.getState('a/cms/languages');
      return stateLanguages[this.atomClass.module];
    },
  },
  created() {
    // load module:cms
    this.$meta.module.use('a-cms', module => {
      this.moduleCMS = module;
      // languages
      this.$store.dispatch('a/cms/getLanguages', {
        atomClass: this.atomClass,
      });
    });
  },
  methods: {
    combineAtomClass(url) {
      return utils.combineAtomClass(this.atomClass, url);
    },
    adjustTags(tags) {
      if (!tags) return '';
      const _tags = JSON.parse(tags);
      return _tags.map(item => item.name).join(',');
    },
    onChooseEditContent() {
      if (!this.item.categoryId) {
        return false;
      }
      const url = this.combineAtomClass('/a/cms/article/contentEdit');
      this.$view.navigate(url, {
        target: '_self',
        context: {
          params: {
            ctx: this,
            item: this.item,
            readOnly: this.readOnly,
          },
          callback: (code, data) => {
            if (code === 200) {
              this.item.content = data.content;
            }
          },
        },
      });
    },
  },
};

</script>
<style scoped>
</style>
