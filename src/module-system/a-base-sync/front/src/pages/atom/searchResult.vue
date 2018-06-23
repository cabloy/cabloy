<template>
  <f7-page ptr @ptr:refresh="onRefresh" infinite :infinitePreloader="false" @infinite="onInfinite">
    <eb-navbar :title="$text('Search Result')" eb-back-link="Back"></eb-navbar>
    <atoms ref="list" mode="search" :params="params" :atomClass="atomClass"></atoms>
  </f7-page>
</template>
<script>
import Vue from 'vue';
const ebPageContext = Vue.prototype.$meta.module.get('a-components').options.components.ebPageContext;
import atoms from '../../components/atom/list.vue';
export default {
  mixins: [ebPageContext],
  components: {
    atoms,
  },
  data() {
    return {};
  },
  computed: {
    params() {
      return this.contextParams;
    },
    atomClass() {
      return this.contextParams.atomClass;
    },
  },
  methods: {
    onRefresh(event, done) { // eslint-disable-line
      done();
      this.$refs.list.reload();
    },
    onInfinite() {
      this.$refs.list.loadMore();
    },
  },
  mounted() {
    this.$refs.list.reload(true);
  },
};

</script>
