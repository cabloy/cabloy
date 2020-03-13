<template>
  <eb-page ptr @ptr:refresh="onRefresh" infinite :infinitePreloader="false" @infinite="onInfinite">
    <eb-navbar large largeTransparent :title="$text('Search Result')" eb-back-link="Back">
      <f7-nav-right>
        <eb-link iconMaterial="sort" :onPerform="onPerformAtomOrders"></eb-link>
        <eb-link v-if="mode==='selectSearch'" iconMaterial="done" :onPerform="onPerformDone"></eb-link>
      </f7-nav-right>
    </eb-navbar>
    <atoms ref="list" :mode="modeAtoms" :params="params" :atomClass="atomClass" :where="where"></atoms>
  </eb-page>
</template>
<script>
import Vue from 'vue';
const ebPageContext = Vue.prototype.$meta.module.get('a-components').options.mixins.ebPageContext;
import atoms from '../../components/atom/list.vue';
export default {
  mixins: [ebPageContext],
  components: {
    atoms,
  },
  data() {
    const query = this.$f7route.query;
    const module = query && query.module;
    const atomClassName = query && query.atomClassName;
    const atomClass = (module && atomClassName) ? { module, atomClassName } : null;
    const where = (query && query.where) ? JSON.parse(query.where) : null;
    const mode = query && query.mode;
    return {
      atomClass,
      where,
      mode,
    };
  },
  computed: {
    params() {
      return this.contextParams;
    },
    modeAtoms() {
      return this.mode || 'search';
    },
  },
  mounted() {
    this.$refs.list.reload(true);
  },
  methods: {
    onRefresh(done) {
      done();
      this.$refs.list.reload();
    },
    onInfinite() {
      this.$refs.list.loadMore();
    },
    onPerformAtomOrders(event) {
      this.$refs.list.openPopoverForAtomOrders(event.currentTarget);
    },
    onPerformDone(event) {
      // selected atoms
      const selectedAtoms = this.$refs.list.getSelectedAtoms();
      // callback
      this.contextCallback(200, selectedAtoms);
      // close view
      this.$view.close();
    },
  },
};

</script>
