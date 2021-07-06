<template>
  <eb-page>
    <eb-navbar large largeTransparent :title="pageTitle" eb-back-link="Back">
      <f7-nav-right>
        <eb-link iconMaterial="save" :onPerform="onPerformSave"></eb-link>
      </f7-nav-right>
    </eb-navbar>
    <eb-validate ref="validate" auto :data="category" :params="{ module: 'a-base', validator: 'category' }" :onPerform="onPerformValidate"> </eb-validate>
  </eb-page>
</template>
<script>
export default {
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
      const title = this.$text('Category');
      if (!this.category) return title;
      return `${title}: ${this.category.categoryName}`;
    },
  },
  created() {
    this.$api.post('/a/base/category/item', { categoryId: this.categoryId }).then(data => {
      this.category = data;
    });
  },
  methods: {
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
      this.$f7router.back();
    },
    onPerformSave() {
      return this.$refs.validate.perform();
    },
  },
};
</script>
