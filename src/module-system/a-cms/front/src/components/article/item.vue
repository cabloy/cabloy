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
  methods: {},
};

</script>
<style scoped>


</style>
