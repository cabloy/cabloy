<template>
  <eb-page>
    <atoms ref="list" :atomClass="atomClass" :where="where" :params="params" :scene="scene" :mode="mode"></atoms>
  </eb-page>
</template>
<script>
import atoms from '../../components/atom/listLayoutManager.vue';
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
    return {
      atomClass,
      where,
      params,
      scene,
      mode,
    };
  },
  created() {
  },
  methods: {
  },
};

</script>
