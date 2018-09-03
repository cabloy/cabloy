<template>
  <div>
    <template v-if="this.mode==='edit'">
      <f7-list>
        <f7-list-item>
          <f7-label floating>{{$text('Atom Name')}}</f7-label>
          <eb-input type="text" clear-button v-model="item.atomName" dataPath="atomName"></eb-input>
        </f7-list-item>
        <f7-list-item smartSelect :title="$text('Language')" :smartSelectParams="{openIn: 'page', closeOnSelect: true}">
          <eb-select name="language" v-model="item.language" dataPath="language" :options="languages"></eb-select>
        </f7-list-item>
        <eb-list-item-choose eb-href="#" dataPath="categoryId" :title="$text('Category')" :onPerform="onPerformChooseCategory">
          <div slot="after">{{item.categoryName}}</div>
        </eb-list-item-choose>
        <f7-list-item>
          <span>{{$text('Sticky')}}</span>
          <eb-toggle v-model="item.sticky" dataPath="sticky"></eb-toggle>
        </f7-list-item>
        <f7-list-item>
          <f7-label floating>{{$text('Keywords')}}</f7-label>
          <eb-input type="text" clear-button v-model="item.keywords" dataPath="keywords"></eb-input>
        </f7-list-item>
        <f7-list-item>
          <f7-label floating>{{$text('Description')}}</f7-label>
          <eb-input type="text" clear-button v-model="item.description" dataPath="description"></eb-input>
        </f7-list-item>
        <eb-list-item-choose eb-href="#" dataPath="content" :title="$text('Content')" :onPerform="onPerformEditContent">
        </eb-list-item-choose>
      </f7-list>
    </template>
    <template v-else></template>
  </div>
</template>
<script>
export default {
  meta: {
    global: false,
  },
  props: {
    // mode: edit/view
    mode: {
      type: String,
    },
    item: {
      type: Object,
    },
  },
  data() {
    return {};
  },
  computed: {
    languages() {
      let _languages = this.$local.getters('languages');
      if (!_languages) return [];
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
    onPerformChooseCategory() {
      if (!this.item.language) {
        return this.$view.dialog.alert(this.$text('Please specify the language'));
      }
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
            }
          },
        },
      });
    },
    onPerformEditContent() {
      this.$view.navigate('/a/cms/article/contentEdit', {
        context: {
          params: {
            ctx: this,
            item: this.item,
          },
          callback: (code, data) => {
            if (code === 200) {
              console.log(data);
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
