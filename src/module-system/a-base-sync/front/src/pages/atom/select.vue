<template>
  <eb-page ptr @ptr:refresh="onRefresh" infinite :infinitePreloader="false" @infinite="onInfinite">
    <eb-navbar :title="pageTitle" eb-back-link="Back">
      <f7-nav-right>
        <eb-link iconMaterial="add" :onPerform="onPerformAdd"></eb-link>
        <eb-link iconMaterial="done" :onPerform="onPerformDone"></eb-link>
      </f7-nav-right>
    </eb-navbar>
    <atoms ref="list" mode="select" :params="params" :atomClass="atomClass"></atoms>
  </eb-page>
</template>
<script>
import Vue from 'vue';
const ebPageContext = Vue.prototype.$meta.module.get('a-components').options.components.ebPageContext;
import ebAtomClasses from '../../common/atomClasses.js';
import atoms from '../../components/atom/list.vue';
export default {
  mixins: [ ebPageContext, ebAtomClasses ],
  components: {
    atoms,
  },
  data() {
    return {
      params: null,
      selectMode: null,
      atomClass: null,
      where: null,
    };
  },
  computed: {
    pageTitle() {
      let atomClassTitle;
      const atomClass = this.getAtomClass(this.atomClass);
      if (!atomClass) {
        atomClassTitle = this.$text('Atom');
      } else {
        atomClassTitle = atomClass.titleLocale;
      }
      return `${this.$text('Select')} ${atomClassTitle}`;
    },
  },
  mounted() {
    // pageContext
    const contextParams = this.contextParams;
    // params
    let selectedAtomIds;
    if (contextParams.selectMode === 'single') {
      selectedAtomIds = contextParams.selectedAtomId ? [ contextParams.selectedAtomId ] : null;
    } else {
      selectedAtomIds = contextParams.selectedAtomIds;
    }
    this.params = { selectedAtomIds };
    // selectMode
    this.selectMode = contextParams.selectMode;
    // atomClass
    this.atomClass = contextParams.atomClass;
    // where
    this.where = contextParams.where;
    // reload
    this.$nextTick(() => {
      this.$refs.list.reload(true);
    });
  },
  methods: {
    onRefresh(event, done) { // eslint-disable-line
      done();
      this.$refs.list.reload();
    },
    onInfinite() {
      this.$refs.list.loadMore();
    },
    onPerformAdd() {
      const queries = {};
      const atomClass = this.atomClass;
      if (atomClass) {
        queries.module = atomClass.module;
        queries.atomClassName = atomClass.atomClassName;
      }
      if (this.where) {
        queries.where = JSON.stringify(this.where);
      }
      queries.mode = 'selectSearch';
      queries.selectMode = this.selectMode;
      const url = this.$meta.util.combineQueries('/a/base/atom/search', queries);
      this.$view.navigate(url, {
        target: '_self',
        context: {
          params: {},
          callback: (code, data) => {
            if (code === 200) {
              console.log(data);
            }
          },
        },
      });
    },
    onPerformDone() {

    },
  },
};

</script>
