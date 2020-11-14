export default {
  data() {
    return {
      filter: {
        data: null,
      },
    };
  },
  methods: {
    filter_prepareSelectParams() {
      if (!this.filter.data) return null;
      // options
      const options = {
        where: {},
      };
      // params
      const params = {
        options,
      };
      // form
      const form = this.filter.data.form;
      if (form) {
        if (form.atomName) {
          options.where['a.atomName'] = { val: form.atomName, op: 'like' };
        }
        if (form.star) {
          options.star = Number(form.star);
        }
        if (form.label) {
          options.label = form.label;
        }
        if (form.stage) {
          options.stage = form.stage;
        }
        if (form.atomClass) {
          params.atomClass = form.atomClass;
        }
      }
      // formAtomClass
      const formAtomClass = this.filter.data.formAtomClass;
      if (formAtomClass) {
        let hasValue = false;
        for (const key in formAtomClass) {
          const value = formAtomClass[key];
          // undefined/null/'', except 0/false
          if (value !== undefined && value !== null && value !== '') {
            if (typeof value === 'string') {
              options.where[`f.${key}`] = { val: value, op: 'like' };
            } else {
              options.where[`f.${key}`] = value;
            }
            hasValue = true;
          }
        }
        if (hasValue) {
          options.mode = 'search';
        }
      }
      // ok
      return params;
    },
    filter_getConfig() {
      return this.$meta.util.getProperty(this.base.config, 'render.list.info.filter');
    },
    filter_onPerform() {
      const inPanel = this.$view.inPanel();
      const immediate = this.$meta.vueApp.layout === 'pc' && !inPanel;
      const filterConfig = this.filter_getConfig();
      const navigateOptions = {
        context: {
          params: {
            layoutManager: this,
            filterConfig,
            immediate,
          },
        },
      };
      if (immediate) {
        navigateOptions.scene = 'sidebar';
        navigateOptions.sceneOptions = { side: 'right', name: 'filter', title: 'Filter' };
      } else {
        navigateOptions.target = '_self';
      }
      this.$view.navigate('/a/baselayout/listLayoutFilter', navigateOptions);
    },
    filter_onChanged(value) {
      this.filter.data = value;
      // reload
      this.page_onRefresh();
    },
    filter_renderAction() {
      if (this.container.params && this.container.params.disableFilter === true) return null;
      return (
        <eb-link iconMaterial="search" propsOnPerform={this.filter_onPerform}></eb-link>
      );
    },
  },
};
