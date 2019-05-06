<template>
  <eb-page>
    <eb-navbar :title="pageTitle" eb-back-link="Back">
      <f7-nav-right>
        <eb-button ref="buttonSubmit" iconMaterial="search" :onPerform="onPerformSearch"></eb-button>
      </f7-nav-right>
    </eb-navbar>
    <eb-list form no-hairlines-md @submit.prevent="onFormSubmit">
      <f7-list-item>
        <f7-label floating>{{$text('Atom Name')}}</f7-label>
        <eb-input type="text" :placeholder="$text('Atom Name')" clear-button v-model="atomName"></eb-input>
      </f7-list-item>
      <f7-list-item smartSelect :title="$text('Label')" :smartSelectParams="{openIn: 'page', closeOnSelect: true}">
        <eb-select name="label" v-model="label" :options="labels"></eb-select>
      </f7-list-item>
      <f7-list-item divider></f7-list-item>
      <f7-list-item v-if="!atomClassInit" :title="$text('Atom Class')" link="#" @click="onSelectAtomClass">
        <div slot="after">{{atomClassTitle}}</div>
      </f7-list-item>
    </eb-list>
    <eb-validate v-if="item && validateParams" ref="validate" auto :data="item" :params="validateParams">
    </eb-validate>
  </eb-page>
</template>
<script>
import Vue from 'vue';
const ebPageContext = Vue.prototype.$meta.module.get('a-components').options.components.ebPageContext;
import ebAtomClasses from '../../common/atomClasses.js';
export default {
  mixins: [ ebPageContext, ebAtomClasses ],
  data() {
    const query = this.$f7route.query;
    const module = query && query.module;
    const atomClassName = query && query.atomClassName;
    const atomClass = (module && atomClassName) ? { module, atomClassName } : null;
    const where = (query && query.where) ? JSON.parse(query.where) : null;
    const mode = query && query.mode;
    const selectMode = query && query.selectMode;
    return {
      atomName: '',
      label: 0,
      atomClass,
      where,
      item: null,
      validateParams: null,
      atomClassInit: atomClass,
      mode,
      selectMode,
    };
  },
  computed: {
    pageTitle() {
      const atomClassTitle = this.atomClassTitle || this.$text('Atom');
      return `${this.$text('Search')} ${atomClassTitle}`;
    },
    labels() {
      const labelsAll = this.$local.getters('userLabels');
      if (!labelsAll) return null;

      const labels = [{ title: '', value: 0 }];
      for (const key in labelsAll) {
        labels.push({ title: labelsAll[key].text, value: key });
      }
      return labels;
    },
    atomClassTitle() {
      if (!this.atomClass) return '';
      if (this.atomClass.title) return this.atomClass.title;
      const _atomClass = this.getAtomClass(this.atomClass);
      if (!_atomClass) return '';
      return _atomClass.titleLocale;
    },
  },
  watch: {
    atomClass(value) {
      this.atomClassChanged();
    },
  },
  created() {
    // labels
    this.$local.dispatch('getLabels');
    // init atomClass
    this.atomClassChanged();
  },
  methods: {
    onFormSubmit() {
      this.$refs.buttonSubmit.onClick();
    },
    atomClassChanged() {
      const atomClass = this.atomClass;
      if (!atomClass) {
        this.item = null;
        this.validateParams = null;
      } else {
        // module
        this.$meta.module.use(atomClass.module, () => {
          // validateParams
          this.$api.post('atomClass/validatorSearch', {
            atomClass: {
              module: atomClass.module,
              atomClassName: atomClass.atomClassName,
            },
          }).then(data => {
            this.item = {};
            this.validateParams = {
              module: data.module,
              validator: data.validator,
            };
          });
        });
      }
    },
    onSelectAtomClass() {
      this.$view.navigate('/a/base/atom/selectAtomClass', {
        target: '_self',
        context: {
          params: {
            atomClass: this.atomClass,
            optional: true,
          },
          callback: (code, data) => {
            if (code === 200) {
              this.atomClass = data;
            }
          },
        },
      });
    },
    onPerformSearch() {
      // atomClassExtra
      let atomClassExtra;
      if (this.item) {
        atomClassExtra = {};
        for (const key in this.item) {
          const value = this.item[key];
          // undefined/null/'', except 0/false
          if (value !== undefined && value !== null && value !== '') {
            if (typeof value === 'string') {
              atomClassExtra[`f.${key}`] = { val: value, op: 'like' };
            } else {
              atomClassExtra[`f.${key}`] = value;
            }
          }
        }
      }
      // url
      const queries = {};
      const atomClass = this.atomClass;
      if (atomClass) {
        queries.module = atomClass.module;
        queries.atomClassName = atomClass.atomClassName;
      }
      if (this.where) {
        queries.where = JSON.stringify(this.where);
      }
      queries.mode = this.mode;
      queries.selectMode = this.selectMode;
      const url = this.$meta.util.combineQueries('/a/base/atom/searchResult', queries);
      this.$view.navigate(url, {
        target: '_self',
        context: {
          params: {
            atomName: this.atomName,
            label: this.label,
            atomClassExtra,
          },
        },
      });
    },
  },
};

</script>
<style scoped>
</style>
