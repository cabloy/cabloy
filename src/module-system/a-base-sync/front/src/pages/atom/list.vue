<template>
  <eb-page ptr @ptr:refresh="onPageRefresh" infinite :infinitePreloader="false" @infinite="onPageInfinite">
    <atoms ref="list" :atomClass="atomClass" :where="where" :params="params" :scene="scene" :mode="mode" :layout="layout"></atoms>
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
    const where = (query && query.where) ? JSON.parse(query.where) : null;
    const params = (query && query.params) ? JSON.parse(query.params) : null;
    const scene = query && query.scene;
    const mode = query && query.mode;
    const layout = query && query.mode;
    return {
      atomClass,
      where,
      params,
      scene,
      mode,
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
