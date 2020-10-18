import Vue from 'vue';
const ebAtomClasses = Vue.prototype.$meta.module.get('a-base').options.mixins.ebAtomClasses;
export default {
  meta: {
    global: false,
  },
  mixins: [ ebAtomClasses ],
  props: {
    layoutManager: {
      type: Object,
    },
    filterConfig: {
      type: Object,
    },
  },
  data() {
    return {
      immediate: true,
      form: {
        atomName: null,
        label: 0,
        atomClass: null,
      },
      formAtomClass: null,
    };
  },
  computed: {
    pageTitle() {
      return this.$text('Filter');
    },
    userLabels() {
      const labelsAll = this.$store.getters['a/base/userLabels'];
      if (!labelsAll) return null;

      const labels = [{ title: '', value: 0 }];
      for (const key in labelsAll) {
        labels.push({ title: labelsAll[key].text, value: key });
      }
      return labels;
    },
    atomClass() {
      return this.form.atomClass || this.layoutManager.atomClass;
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
    form: {
      deep: true,
      handler(form, formOld) {
        if (form.atomClass !== formOld.atomClass) {
          this.atomClassChanged();
        }
      },
    },
  },
  created() {
    // labels
    this.$store.dispatch('a/base/getLabels');
    // init atomClass
    this.atomClassChanged();
  },
  mounted() {
    // immediate
    const $el = this.$$(this.$el);
    const $view = $el.parents('.eb-layout-view');
    this.immediate = $view.is('.eb-layout-panel-view');
  },
  methods: {
    onFormSubmit() {
      this.$refs.buttonSubmit.onClick();
    },
    atomClassChanged() {
      const atomClass = this.atomClass;
      if (!atomClass) {
        this.formAtomClass = null;
      } else {
        // module
        this.$meta.module.use(atomClass.module, () => {
          // validateParams
          this.$api.post('/a/base/atomClass/validatorSearch', {
            atomClass: {
              module: atomClass.module,
              atomClassName: atomClass.atomClassName,
            },
          }).then(data => {
            this.formAtomClass = {
              item: {},
              validateParams: {
                module: data.module,
                validator: data.validator,
              },
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
              this.form.atomClass = data;
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
      const url = this.$meta.util.combineQueries('/a/base/atom/searchResult', queries);
      this.$view.navigate(url, {
        target: '_self',
        context: {
          params: {
            atomName: this.atomName,
            label: this.label,
            atomClassExtra,
            selectMode: this.selectMode,
          },
          callback: (code, data) => {
            if (code === 200) {
              if (this.mode === 'selectSearch') {
                this.contextCallback(200, data);
              }
            }
          },
        },
      });
    },
    _renderNavbar() {
      return (
        <eb-navbar title={this.pageTitle} eb-back-link="Back">
          <f7-nav-right>
            {!this.immediate && <eb-link ref="buttonSubmit" iconMaterial="search" propsOnPerform={this.onPerformSearch}></eb-link>}
          </f7-nav-right>
        </eb-navbar>
      );
    },
    _renderForm() {
      return (
        <eb-list form inline-labels no-hairlines-md onSubmit={this.onFormSubmit}>
          <eb-list-input v-model={this.form.atomName} label={this.$text('Atom Name')} type="text" clear-button placeholder={this.$text('Atom Name')}></eb-list-input>
          <f7-list-item smartSelect title={this.$text('Label')} smartSelectParams={{ openIn: 'page', closeOnSelect: true }}>
            <eb-select name="label" v-model={this.form.label} options={this.userLabels}></eb-select>
          </f7-list-item>
          <f7-list-item divider></f7-list-item>
          {!this.layoutManager.atomClass && <f7-list-item title={this.$text('Atom Class')} link="#" onClick={this.onSelectAtomClass}>
            <div slot="after">{this.atomClassTitle}</div>
          </f7-list-item>}
        </eb-list>
      );
    },
    _renderFormAtomClass() {
      if (!this.formAtomClass) return null;
      return (
        <eb-validate ref="validate" auto data={this.formAtomClass.item} params={this.formAtomClass.validateParams} onSubmit={this.onFormSubmit}>
        </eb-validate>
      );
    },
  },
  render() {
    return (
      <div>
        {this._renderNavbar()}
        {this._renderForm()}
        {this._renderFormAtomClass()}
      </div>
    );
  },
};
