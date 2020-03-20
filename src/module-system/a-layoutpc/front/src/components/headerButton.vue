<script>
export default {
  render(c) {
    const children = [];
    if (!this.errorMessage && this.ready) {
      // props
      const props = {
        button: this, // for more extensible
      };
      children.push(c(this.layout._buttonFullName(this.options), {
        staticClass: 'header-button-inner',
        props,
        on: {
          'buttonReal:ready': this.__onButtonRealReady,
          'buttonReal:destroy': this.__onButtonRealDestroy,
        },
      }));
    } else if (this.errorMessage) {
      children.push(c('div', {
        staticClass: 'header-button-inner header-button-inner-error',
        domProps: { innerText: this.errorMessage },
      }));
    }
    return c('div', {
      staticClass: 'header-button',
      directives: [{
        name: 'eb-dragdrop',
        value: {
          scene: this.dragdropScene,
          button: this.options,
          onDragStart: this.onDragStart,
          onDropElement: this.onDropElement,
          onDragDone: this.onDragDone,
        }
      }],
    }, children);
  },
  props: {
    options: {
      type: Object,
    },
    dragdropScene: {
      type: String,
    }
  },
  data() {
    return {
      ready: false,
      errorMessage: null,
    };
  },
  computed: {
    layout() {
      return this.group.layout;
    },
    buttons() {
      return this.group.buttons;
    },
    group() {
      return this.$parent;
    },
  },
  created() {
    this.__init();
  },
  beforeDestroy() {
    this.$emit('button:destroy');
  },
  methods: {
    __init() {
      this.$meta.module.use(this.options.module, module => {
        const fullName = this.layout._buttonFullName(this.options);
        let component = module.options.components[this.options.name];
        if (!component) {
          this.errorMessage = `${this.$text('Button Not Found')}: ${fullName}`;
          this.ready = false;
        } else {
          component = this.$meta.util.createComponentOptions(component);
          this.$options.components[fullName] = component;
          this.ready = true;
          this.errorMessage = null;
        }
      });
    },
    onDragStart({ $el, context, dragElement }) {
      const [button, buttonIndexDrag] = this.group._getButtonAndIndex(context.button);
      const tooltip = this.__getButtonTitle(button);
      return { tooltip };
    },
    onDropElement({ $el, context, dragElement, dragContext }) {
      const [buttonDrop, buttonIndexDrop] = this.group._getButtonAndIndex(context.button);
      const [buttonDrag, buttonIndexDrag] = this.group._getButtonAndIndex(dragContext.button);
      if (buttonIndexDrop === buttonIndexDrag || buttonIndexDrop == buttonIndexDrag + 1) return null;
      // dropElement
      const dropElement = $el;
      // tooltip
      const tooltip = this.__getButtonTitle(buttonDrop);
      // ok
      return { dropElement, tooltip };
    },
    onDragDone({ $el, context, dragElement, dropElement, dropContext }) {
      const buttonIndexDrag = this.group._getButtonIndex(context.button);
      this.group.buttons.splice(buttonIndexDrag, 1);
      const buttonIndexDrop = this.group._getButtonIndex(dropContext.button);
      this.group.buttons.splice(buttonIndexDrop, 0, context.button);
      // save
      this.layout.__saveLayoutConfig();
    },
    __getButtonTitle(button) {
      return button.titleLocale || this.$text(button.title) || button.name;
    },
    __onButtonRealReady(buttonReal) {
      const fullName = this.layout._buttonFullName(this.options);
      this.group.buttonsReal[fullName] = buttonReal;
    },
    __onButtonRealDestroy(buttonReal) {
      const fullName = this.layout._buttonFullName(this.options);
      delete this.group.buttonsReal[fullName];
    },
  }

}

</script>
