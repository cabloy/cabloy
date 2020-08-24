<script>
export default {
  meta: {
    global: true,
  },
  name: 'eb-component',
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
  render(c) {
    const children = [];
    if (this.ready && !this.errorMessage) {
      // not use this.$meta.util.extend && this.$utils.extend, so as to hold __ob__
      const options = Object.assign({}, this.options, { ref: 'component' });
      children.push(c(this.__getFullName(), options));
    } else if (this.errorMessage) {
      children.push(c('div', {
        //staticClass: 'text-align-center',
        domProps: { innerText: this.errorMessage },
      }));
    }
    //
    return c('div', children);
  },
  created() {
    this.$meta.module.use(this.module, moduleInstance => {
      this.moduleInstance = moduleInstance;
      const fullName = this.__getFullName();
      let component = moduleInstance.options.components[this.name];
      if (!component) {
        this.errorMessage = `${this.$text('Component Not Found')}: ${fullName}`;
        this.ready = false;
      } else {
        component = this.$meta.util.createComponentOptions(component);
        this.$options.components[fullName] = component;
        this.ready = true;
        this.errorMessage = null;
      }
    });
  },
  methods: {
    getComponentInstance() {
      return this.$refs.component;
    },
    __getFullName() {
      return `${this.module}:${this.name}`;
    },
  }
};

</script>
<style scoped>
</style>
