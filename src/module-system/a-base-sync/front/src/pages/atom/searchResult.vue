<template>
  <eb-page ptr @ptr:refresh="onRefresh" infinite :infinitePreloader="false" @infinite="onInfinite">
    <eb-navbar :title="$text('Search Result')" eb-back-link="Back">
      <f7-nav-right>
        <eb-link iconMaterial="sort" :onPerform="onPerformAtomOrders"></eb-link>
      </f7-nav-right>
    </eb-navbar>
    <atoms ref="list" mode="search" :params="params" :atomClass="atomClass" :where="where"></atoms>
  </eb-page>
</template>
<script>
import Vue from 'vue';
const ebPageContext = Vue.prototype.$meta.module.get('a-components').options.components.ebPageContext;
import atoms from '../../components/atom/list.vue';
export default {
  mixins: [ ebPageContext ],
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
    where() {
      return this.contextParams.where;
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
    onPerformAtomOrders(event) {
      this.$refs.list.openPopoverForAtomOrders(event.currentTarget);
    },
  },
  mounted() {
    this.$refs.list.reload(true);
  },
};

</script>
