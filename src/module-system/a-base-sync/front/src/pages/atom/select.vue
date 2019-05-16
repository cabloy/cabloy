<template>
  <eb-page ptr ptrMousewheel @ptr:refresh="onRefresh" infinite :infinitePreloader="false" @infinite="onInfinite">
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
    // selectMode
    this.selectMode = contextParams.selectMode;
    // atomClass
    this.atomClass = contextParams.atomClass;
    // where
    this.where = contextParams.where;
    // params
    let selectedAtomIds;
    if (contextParams.selectMode === 'single') {
      selectedAtomIds = contextParams.selectedAtomId ? [ contextParams.selectedAtomId ] : null;
    } else {
      selectedAtomIds = contextParams.selectedAtomIds ? contextParams.selectedAtomIds.concat() : null;
    }
    this.params = {
      selectMode: this.selectMode,
      selectedAtomIds,
    };
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
              this._updateSelectedAtoms(data);
            }
          },
        },
      });
    },
    _updateSelectedAtoms(selectedAtoms) {
      this.$refs.list.updateSelectedAtoms(selectedAtoms);
    },
    onPerformDone() {
      // selectedAtoms
      const selectedAtoms = this.$refs.list.getSelectedAtoms();
      let res;
      if (this.selectMode === 'single') {
        res = (selectedAtoms && selectedAtoms.length > 0) ? selectedAtoms[0] : null;
      } else {
        res = (selectedAtoms && selectedAtoms.length > 0) ? selectedAtoms : null;
      }
      // ok
      this.contextCallback(200, res);
      this.$f7router.back();
    },
  },
};

</script>
