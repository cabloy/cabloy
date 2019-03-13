<template>
  <eb-page>
    <eb-navbar :title="title" eb-back-link="Back">
      <f7-nav-right>
        <eb-link iconMaterial="save" :onPerform="onPerformSave"></eb-link>
      </f7-nav-right>
    </eb-navbar>
    <eb-validate ref="validate" auto :data="category" :params="{validator: 'category'}" :onPerform="onPerformValidate">
    </eb-validate>
  </eb-page>
</template>
<script>
import utils from '../../common/utils.js';
export default {
  data() {
    const atomClass = utils.parseAtomClass(this.$f7route.query);
    return {
      atomClass,
      categoryId: this.$f7route.query.categoryId,
      category: null,
    };
  },
  computed: {
    title() {
      let _title = this.$text('Category');
      if (this.category) _title = `${_title}: ${this.category.categoryName}`;
      return _title;
    },
  },
  created() {
    this.$api.post('category/item', { categoryId: this.categoryId }).then(data => {
      this.category = data;
    });
  },
  methods: {
    onPerformValidate() {
      return this.$api.post('category/save', {
        categoryId: this.categoryId,
        data: this.category,
      }).then(() => {
        this.$meta.eventHub.$emit('a-cms:category:save', {
          atomClass: this.atomClass,
          categoryId: this.categoryId,
          categoryIdParent: this.category.categoryIdParent,
          category: this.category,
        });
        this.$f7router.back();
      });
    },
    onPerformSave() {
      return this.$refs.validate.perform();
    },
  },
};

</script>
