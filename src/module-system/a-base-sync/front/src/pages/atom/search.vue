<template>
  <eb-page>
    <eb-navbar :title="$text('Search Atom')" eb-back-link="Back">
      <f7-nav-right>
        <eb-link iconMaterial="search" @click.prevent="onSearch"></eb-link>
      </f7-nav-right>
    </eb-navbar>
    <f7-list form no-hairlines-md>
      <f7-list-item>
        <f7-label floating>{{$text('Atom name')}}</f7-label>
        <eb-input type="text" :placeholder="$text('Atom name')" clear-button v-model="atomName"></eb-input>
      </f7-list-item>
      <f7-list-item smartSelect :title="$text('Label')" :smartSelectParams="{openIn: 'page', closeOnSelect: true}">
        <eb-select name="label" v-model="label" :options="labels"></eb-select>
      </f7-list-item>
      <f7-list-item divider></f7-list-item>
      <f7-list-item :title="$text('Atom class')" link="#" @click="onSelectAtomClass">
        <div slot="after">{{atomClassTitle}}</div>
      </f7-list-item>
    </f7-list>
    <eb-validate v-if="item && validateParams" ref="validate" auto :data="item" :params="validateParams">
    </eb-validate>
  </eb-page>
</template>
<script>
import ebAtomClasses from '../../common/atomClasses.js';
export default {
  mixins: [ ebAtomClasses ],
  data() {
    return {
      atomName: '',
      label: 0,
      atomClass: null,
      item: null,
      validateParams: null,
    };
  },
  computed: {
    labels() {
      const labelsAll = this.$local.state.labels;
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
      if (!value) {
        this.item = null;
        this.validateParams = null;
      } else {
        const atomClass = this.atomClass;
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
  },
  created() {
    // labels
    this.$local.dispatch('getLabels');
    // init atomClass
    const query = this.$f7route.query;
    const module = query && query.module;
    const atomClassName = query && query.atomClassName;
    this.atomClass = (module && atomClassName) ? { module, atomClassName } : null;
  },
  methods: {
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
    onSearch() {
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

      this.$view.navigate('/a/base/atom/searchResult', {
        target: '_self',
        context: {
          params: {
            atomName: this.atomName,
            label: this.label,
            atomClass: this.atomClass,
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
