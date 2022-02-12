<template>
  <eb-page>
    <eb-navbar large largeTransparent :title="pageTitle" eb-back-link="Back">
      <f7-nav-right>
        <eb-link iconMaterial="save" ref="buttonSubmit" :onPerform="onPerformSave"></eb-link>
      </f7-nav-right>
    </eb-navbar>
    <eb-validate
      ref="validate"
      auto
      :data="category"
      :params="{ module: 'a-base', validator: 'category' }"
      :onPerform="onPerformValidate"
      @submit="onSubmit"
      @validateItem:change="onValidateItemChange"
    >
    </eb-validate>
  </eb-page>
</template>
<script>
import Vue from 'vue';
const ebPageDirty = Vue.prototype.$meta.module.get('a-components').options.mixins.ebPageDirty;
export default {
  mixins: [ebPageDirty],
  data() {
    const query = this.$f7route.query;
    const atomClass = {
      module: query.module,
      atomClassName: query.atomClassName,
    };
    const language = query.language;
    const categoryId = query.categoryId;
    return {
      atomClass,
      language,
      categoryId,
      category: null,
    };
  },
  computed: {
    pageTitle() {
      let title = this.$text('Category');
      if (this.category) {
        title = `${title}: ${this.category.categoryName}`;
      }
      return this.page_getDirtyTitle(title);
    },
  },
  created() {
    this.$api.post('/a/base/category/item', { categoryId: this.categoryId }).then(data => {
      this.category = data;
    });
  },
  methods: {
    onValidateItemChange() {
      this.page_setDirty(true);
    },
    onSubmit() {
      this.$refs.buttonSubmit.onClick();
    },
    async onPerformValidate() {
      await this.$api.post('/a/base/category/save', {
        categoryId: this.categoryId,
        data: this.category,
      });
      this.$meta.eventHub.$emit('category:save', {
        atomClass: this.atomClass,
        categoryId: this.categoryId,
        categoryIdParent: this.category.categoryIdParent,
        category: this.category,
      });
      // dirty
      this.page_setDirty(false);
      // back
      this.$f7router.back();
    },
    onPerformSave() {
      return this.$refs.validate.perform();
    },
  },
};
</script>
