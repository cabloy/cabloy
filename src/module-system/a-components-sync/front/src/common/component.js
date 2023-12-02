const __baseRenders = [
  'componentAction',
  'renderAtom',
  'renderAtomClass',
  'renderLanguage',
  'renderCategory',
  'renderCategoryResource',
  'renderTags',
  'renderResourceType',
  'renderTableCellDefault',
  'renderTableCellComputed',
  'renderTableCellDatetime',
  'renderTableCellLink',
  'renderTableCellButton',
  'renderTableCellImage',
  'renderTableCellIcon',
  'renderUserLabel',
  'renderUser',
  'renderRole',
  'renderMarkdown',
];
export default {
  props: {
    label: {
      type: String,
    },
    module: {
      type: String,
    },
    name: {
      type: String,
    },
    options: {
      type: Object,
    },
  },
  data() {
    return {
      moduleInstance: null,
      ready: false,
      errorMessage: null,
      showLoading: false,
      debounceTimerId: 0,
      componentInstance: null,
    };
  },
  computed: {
    module2() {
      if (this.module === 'a-basefront' && __baseRenders.includes(this.name)) {
        return 'a-baserender';
      }
      return this.module;
    },
    labelUnique() {
      return `${this.label}_${this.module2}_${this.name}`;
    },
  },
  watch: {
    labelUnique() {
      this.prepareComponent();
    },
  },
  render(c) {
    if (this.ready && !this.errorMessage) {
      return this.renderSuccess(c);
    } else if (this.errorMessage) {
      return this.renderError(c);
    }
    return this.renderLoading(c);
  },
  created() {
    this.prepareComponent();
  },
  beforeDestroy() {
    this.debounceStop();
    this.componentInstance = null;
  },
  methods: {
    renderSuccess(c) {
      // check again
      const fullName = this.__getFullName();
      if (!this.$options.components[fullName]) return c('template');
      // options: not use this.$meta.util.extend && this.$utils.extend, so as to hold __ob__
      const onEvents = Object.assign({}, this.options?.on, {
        componentMounted: componentInstance => {
          this.componentInstance = componentInstance;
          this.$nextTick(() => {
            this.$emit('componentReady', componentInstance);
          });
        },
      });
      const attrs = Object.assign({}, this.options?.attrs);
      if (this.$meta.config.env === 'development') {
        attrs['data-dev-eb-component-name'] = fullName;
      }
      const options = Object.assign({}, this.options, {
        attrs,
        // ref: 'component',
        scopedSlots: this.$scopedSlots,
        on: onEvents,
      });
      const children = [];
      if (this.$slots) {
        for (const key of Object.keys(this.$slots)) {
          children.push(
            c(
              'template',
              {
                key,
                slot: key,
              },
              this.$slots[key]
            )
          );
        }
      }
      return c(fullName, options, children);
    },
    renderError(c) {
      return c('span', {
        staticClass: 'eb-component-error',
        domProps: { innerText: this.errorMessage },
      });
    },
    renderLoading(c) {
      // template
      if (this.checkIfEmpty() || !this.showLoading) {
        return c('template');
      }
      // preloader
      return c('f7-preloader', {
        props: {
          size: 16,
        },
      });
    },
    checkIfEmpty() {
      return !this.module2 || !this.name;
    },
    clearStatus() {
      this.ready = false;
      this.errorMessage = null;
      this.debounceStop();
    },
    debounceStop() {
      this.showLoading = false;
      if (this.debounceTimerId) {
        window.clearTimeout(this.debounceTimerId);
        this.debounceTimerId = 0;
      }
    },
    debounceStart() {
      const debounce = this.$meta.config.nprogress.debounce;
      this.debounceStop();
      this.debounceTimerId = window.setTimeout(() => {
        this.showLoading = true;
      }, debounce);
    },
    async prepareComponent() {
      try {
        // clear
        this.clearStatus();
        // check
        if (this.checkIfEmpty()) return;
        // debounce
        this.debounceStart();
        // module
        const moduleInstance = await this.$meta.module.use(this.module2);
        this.moduleInstance = moduleInstance;
        // component
        const fullName = this.__getFullName();
        let component = moduleInstance.options.components[this.name];
        if (!component) {
          this.errorMessage = `${this.$text('Component Not Found')}: ${fullName}`;
          this.ready = false;
        } else {
          // uses
          await this.$meta.util.createComponentOptionsUses(component);
          // create
          component = this.$meta.util.createComponentOptions(component);
          this.$options.components[fullName] = component;
          this.ready = true;
          this.errorMessage = null;
        }
        // debounce
        this.debounceStop();
      } catch (err) {
        this.ready = false;
        this.errorMessage = err.message;
        // debounce
        this.debounceStop();
      }
    },
    getComponentInstance() {
      return this.componentInstance;
    },
    __getFullName() {
      return `${this.module2}:${this.name}`;
    },
  },
};
