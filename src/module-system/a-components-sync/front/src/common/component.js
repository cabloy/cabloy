export default {
  props: {
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
    };
  },
  watch: {
    module() {
      this.prepareComponent();
    },
    name() {
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
  methods: {
    renderSuccess(c) {
      // check again
      const fullName = this.__getFullName();
      if (!this.$options.components[fullName]) return c('template');
      // options: not use this.$meta.util.extend && this.$utils.extend, so as to hold __ob__
      const options = Object.assign({}, this.options, { ref: 'component', scopedSlots: this.$scopedSlots });
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
      return c('f7-preloader', {
        props: {
          size: 16,
        },
      });
    },
    checkIfEmpty() {
      return !this.module || !this.name;
    },
    async prepareComponent() {
      try {
        // clear
        this.ready = false;
        this.errorMessage = null;
        // check
        if (this.checkIfEmpty()) return;
        // module
        const moduleInstance = await this.$meta.module.use(this.module);
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
      } catch (err) {
        this.ready = false;
        this.errorMessage = err.message;
      }
    },
    getComponentInstance() {
      return this.$refs.component;
    },
    __getFullName() {
      return `${this.module}:${this.name}`;
    },
  },
};
