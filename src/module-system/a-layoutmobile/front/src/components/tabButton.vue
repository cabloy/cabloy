<script>
export default {
  render(c) {
    if (!this.errorMessage && this.ready) {
      // props
      const props = {
        button: this, // for more extensible
      };
      return c(this.buttonFullName, {
        ref: 'button',
        staticClass: `tab-button ${this.showing ? '' : 'display-none'}`,
        props,
        on: {
          'buttonReal:ready': this.__onButtonRealReady,
          'buttonReal:destroy': this.__onButtonRealDestroy,
        },
        directives: [
          {
            name: 'eb-dragdrop',
            value: {
              scene: this.dragdropScene,
              button: this.options,
              onDragStart: this.onDragStart,
              onDropElement: this.onDropElement,
              onDragDone: this.onDragDone,
            },
          },
        ],
      });
    } else if (this.errorMessage) {
      return c('div', {
        staticClass: 'tab-button-inner tab-button-inner-error',
        domProps: { innerText: this.errorMessage },
      });
    }
    return c('div');
  },
  props: {
    layout: {
      type: Object,
    },
    group: {
      type: Object,
    },
    options: {
      type: Object,
    },
    dragdropScene: {
      type: String,
    },
  },
  data() {
    return {
      ready: false,
      errorMessage: null,
      showing: true,
    };
  },
  computed: {
    buttons() {
      return this.group.buttons;
    },
    buttonFullName() {
      return this.layout._buttonFullName(this.options);
    },
  },
  created() {
    this.__init();
  },
  beforeDestroy() {
    this.$emit('button:destroy');
  },
  methods: {
    getButtonInstance() {
      return this.$refs.button;
    },
    async __init() {
      if (!this.options.resourceConfig) {
        // maybe disabled
        this.hide();
        return;
      }
      const fullName = this.buttonFullName;
      const component = await this.$meta.module.useComponent(
        this.options.resourceConfig.module,
        this.options.resourceConfig.component
      );
      if (!component) {
        this.errorMessage = `${this.$text('Button Not Found')}: ${fullName}`;
        this.ready = false;
      } else {
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
    onDragStart({ /* $el,*/ context /* , dragElement */ }) {
      const [button] = this.group._getButtonAndIndex(context.button);
      const tooltip = this.__getButtonTitle(button);
      return { tooltip };
    },
    onDropElement({ $el, context /* , dragElement*/, dragContext }) {
      const [buttonDrop, buttonIndexDrop] = this.group._getButtonAndIndex(context.button);
      const [, /* buttonDrag*/ buttonIndexDrag] = this.group._getButtonAndIndex(dragContext.button);
      if (buttonIndexDrop === buttonIndexDrag || buttonIndexDrop === buttonIndexDrag + 1) return null;
      // dropElement
      const dropElement = $el;
      // tooltip
      const tooltip = this.__getButtonTitle(buttonDrop);
      // ok
      return { dropElement, tooltip };
    },
    onDragDone({ /* $el,*/ context /* , dragElement, dropElement*/, dropContext }) {
      const buttonIndexDrag = this.group._getButtonIndex(context.button);
      // eslint-disable-next-line
      this.group.buttons.splice(buttonIndexDrag, 1);
      const buttonIndexDrop = this.group._getButtonIndex(dropContext.button);
      // eslint-disable-next-line
      this.group.buttons.splice(buttonIndexDrop, 0, context.button);
      // save
      this.layout.__saveLayoutConfig();
    },
    __getButtonTitle(button) {
      return button.titleLocale || this.$text(button.title) || button.name;
    },
    __onButtonRealReady(buttonReal) {
      const fullName = this.buttonFullName;
      // eslint-disable-next-line
      this.group.buttonsReal[fullName] = buttonReal;
    },
    __onButtonRealDestroy(/* buttonReal*/) {
      const fullName = this.buttonFullName;
      // eslint-disable-next-line
      delete this.group.buttonsReal[fullName];
    },
  },
};
</script>
