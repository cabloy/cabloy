<template>
  <eb-page ptr @ptr:refresh="onPageRefresh" infinite :infinitePreloader="false" @infinite="onPageInfinite">
    <atoms ref="list" :atomClass="atomClass" :options="options" :params="params" :scene="scene" :layout="layout"></atoms>
  </eb-page>
</template>
<script>
import atoms from '../../components/atom/listLayoutManager.jsx';
export default {
  components: {
    atoms,
  },
  data() {
    const query = this.$f7route.query;
    const module = query && query.module;
    const atomClassName = query && query.atomClassName;
    const atomClass = (module && atomClassName) ? { module, atomClassName } : null;
    const options = (query && query.options) ? JSON.parse(query.options) : null;
    const params = (query && query.params) ? JSON.parse(query.params) : null;
    const scene = query && query.scene;
    const layout = query && query.layout;
    return {
      atomClass,
      options,
      params,
      scene,
      layout,
    };
  },
  computed: {
    list() {
      return this.$refs.list;
    },
  },
  created() {
  },
  methods: {
    onPageRefresh(done) {
      done();
      this.list && this.list.onPageRefresh();
    },
    onPageInfinite() {
      this.list && this.list.onPageInfinite();
    },
  },
};

</script>
