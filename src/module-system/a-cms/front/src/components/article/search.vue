<template>
  <f7-list>
    <eb-list-item-validate dataKey="language" :options="languages" @change="onChangeLanguage"></eb-list-item-validate>
    <eb-list-item-choose link="#" dataPath="categoryId" :title="$text('Category')" :onChoose="onChooseCategory">
      <div slot="after">{{data.categoryName}}</div>
    </eb-list-item-choose>
    <eb-list-item-validate dataKey="content"></eb-list-item-validate>
  </f7-list>
</template>
<script>
export default {
  meta: {
    global: false,
  },
  props: {
    data: {
      type: Object,
    },
  },
  computed: {
    languages() {
      return this.$local.state.languages;
    },
  },
  created() {
    this.$local.dispatch('getLanguages');
  },
  methods: {
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
        this.$view.navigate('/a/cms/category/select', {
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
