<script>
export default {
  render(c) {
    const children = [];
    if (this.ready) {
      children.push(c(this.__getFullName(), {}));
    }
    return c('div', { staticClass: 'widget-inner' }, children);
  },
  props: {
    options: {
      type: Object,
    }
  },
  data() {
    return {
      ready: false,
    };
  },
  created() {
    this.__init();
  },
  methods: {
    __init() {
      this.$meta.module.use(this.options.module, module => {
        this.$options.components[this.__getFullName()] = module.options.components[this.options.name];
        this.ready = true;
      });
    },
    __getFullName() {
      return `${this.options.module}:${this.options.name}`;
    }

  }
}

</script>
