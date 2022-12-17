<script>
export default {
  render(c) {
    const children = [];
    if (!this.errorMessage && this.ready) {
      // props
      const props = {
        layoutManager: this.layoutManager,
        button: this, // for more extensible
      };
      children.push(
        c(this._buttonFullName(this.options), {
          staticClass: 'atom-button-inner',
          props,
        })
      );
    } else if (this.errorMessage) {
      children.push(
        c('div', {
          staticClass: 'atom-button-inner atom-button-inner-error',
          domProps: { innerText: this.errorMessage },
        })
      );
    }
    return c(
      'div',
      {
        staticClass: `atom-button ${this.showing ? '' : 'display-none'}`,
      },
      children
    );
  },
  props: {
    layoutManager: {
      type: Object,
    },
    action: {
      type: Object,
    },
    config: {
      type: Object,
    },
    renderParams: {
      type: Object,
    },
    onPerform: {
      type: Function,
    },
  },
  data() {
    return {
      ready: false,
      errorMessage: null,
      showing: true,
    };
  },
  created() {
    this.__init();
  },
  beforeDestroy() {
    this.$emit('button:destroy');
  },
  methods: {
    async __init() {
      const module = await this.$meta.module.use(this.renderParams.module);
      const fullName = this._buttonFullName();
      let component = module.options.components[this.renderParams.name];
      if (!component) {
        this.errorMessage = `${this.$text('Button Not Found')}: ${fullName}`;
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
    },
    show() {
      this.showing = true;
    },
    hide() {
      this.showing = false;
    },
    _buttonFullName() {
      return `${this.renderParams.module}:${this.renderParams.name}`;
    },
  },
};
</script>
