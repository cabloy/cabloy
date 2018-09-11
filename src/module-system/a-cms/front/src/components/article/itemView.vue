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
      <f7-list-item :title="$text('Category')">
        <div slot="after">{{item.categoryName}}</div>
      </f7-list-item>
      <eb-list-item-validate dataKey="sticky"></eb-list-item-validate>
      <eb-list-item-validate dataKey="keywords"></eb-list-item-validate>
      <eb-list-item-validate dataKey="description"></eb-list-item-validate>
      <eb-list-item-validate dataKey="slug"></eb-list-item-validate>
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
    onSave() {
      this.$emit('save');
    },
    onChooseEditContent() {
      if (!this.item.categoryId) {
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
