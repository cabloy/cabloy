<template>
  <f7-list>
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
      <eb-list-item-validate dataKey="language" :options="languages"></eb-list-item-validate>
      <eb-list-item-choose link="#" dataPath="categoryId" :title="$text('Category')" :onChoose="onChooseCategory">
        <div slot="after">{{item.categoryName}}</div>
      </eb-list-item-choose>
      <eb-list-item-validate dataKey="keywords"></eb-list-item-validate>
      <eb-list-item-validate dataKey="description"></eb-list-item-validate>
      <eb-list-item-validate dataKey="slug"></eb-list-item-validate>
      <eb-list-item-validate dataKey="allowComment"></eb-list-item-validate>
    </f7-list-group>
    <f7-list-group>
      <f7-list-item group-title :title="$text('Extra')"></f7-list-item>
      <eb-list-item-validate dataKey="sticky"></eb-list-item-validate>
      <eb-list-item-validate dataKey="sorting"></eb-list-item-validate>
      <eb-list-item-validate dataKey="flag"></eb-list-item-validate>
      <eb-list-item-validate dataKey="extra"></eb-list-item-validate>
    </f7-list-group>
  </f7-list>
</template>
<script>
export default {
  props: {
    readOnly: {
      type: Boolean,
    },
    item: {
      type: Object,
    },
    onSave: {
      type: Function,
    },
  },
  computed: {
    languages() {
      let _languages = this.$local.getters('languages');
      if (!_languages) return null;
      _languages = _languages.map(item => {
        return {
          title: item,
          value: item,
        };
      });
      _languages.unshift({ title: '', value: '' });
      return _languages;
    },
  },
  created() {
    this.$local.dispatch('getLanguages');
  },
  methods: {
    onChooseCategory() {
      if (!this.item.language) {
        this.$view.dialog.alert(this.$text('Please specify the language'));
        return false;
      }
      return new Promise(resolve => {
        this.$view.navigate('/a/cms/category/select', {
          context: {
            params: {
              language: this.item.language,
              categoryIdStart: 0,
              leafOnly: true,
            },
            callback: (code, data) => {
              if (code === 200) {
                this.item.categoryId = data.id;
                this.item.categoryName = data.categoryName;
                resolve(true);
              } else if (code === false) {
                resolve(false);
              }
            },
          },
        });
      });
    },
    onChooseEditContent() {
      if (!this.item.categoryId) {
        this.$view.dialog.alert(this.$text('Please specify the category name'));
        return false;
      }
      this.$view.navigate('/a/cms/article/contentEdit', {
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
