<template>
  <eb-page>
    <eb-navbar large largeTransparent :title="$text('Select Category')" eb-back-link="Back">
      <f7-nav-right>
        <eb-link iconMaterial="done" :onPerform="onPerformDone"></eb-link>
      </f7-nav-right>
    </eb-navbar>
    <categorySelect
      ref="tree"
      :atomClass="atomClass"
      :language="language"
      :categoryIdStart="categoryIdStart"
      :multiple="multiple"
      :catalogOnly="catalogOnly"
      :leafOnly="leafOnly"
      :categoryIdDisable="categoryIdDisable"
      :setLocale="setLocale"
    ></categorySelect>
  </eb-page>
</template>
<script>
import Vue from 'vue';
import categorySelect from '../../components/category/categorySelect.jsx';
const ebPageContext = Vue.prototype.$meta.module.get('a-components').options.mixins.ebPageContext;
export default {
  mixins: [ebPageContext],
  components: {
    categorySelect,
  },
  data() {
    const query = this.$f7route.query;
    const atomClass = {
      module: query.module,
      atomClassName: query.atomClassName,
    };
    const language = query.language;
    return {
      atomClass,
      language,
    };
  },
  computed: {
    categoryIdStart() {
      return this.contextParams.categoryIdStart;
    },
    multiple() {
      return this.contextParams.multiple;
    },
    catalogOnly() {
      return this.contextParams.catalogOnly;
    },
    leafOnly() {
      return this.contextParams.leafOnly;
    },
    categoryIdDisable() {
      return this.contextParams.categoryIdDisable;
    },
    setLocale() {
      return this.contextParams.setLocale;
    },
  },
  methods: {
    onPerformDone() {
      const checked = this.$refs.tree.getInstance().checked();
      let res;
      if (!checked || checked.length === 0) {
        res = null;
      } else {
        res = checked;
      }
      this.contextCallback(200, res);
      this.$f7router.back();
    },
  },
};
</script>
