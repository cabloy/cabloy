<script>
import Vue from 'vue';
export default {
  render(c) {
    const tabs = [];
    for (const panel of this.panels) {
      tabs.push(c('f7-link', {
        key: this.layout._panelFullName(panel),
        staticClass: this.layout._panelFullName(panel) === this.sidebar.options.panelActive ? 'active' : '',
        props: {
          text: panel.titleLocale || this.$text(panel.title) || panel.name,
        },
        nativeOn: {
          click: event => {
            this.onClickTab(event, panel);
          },
        },
        directives: [{
          name: 'eb-dragdrop',
          value: {
            scene: this.dragdropScene,
            onDragElement: this.onDragElement,
            onDropElement: this.onDropElement,
            onDropLeave: this.onDropLeave,
            onDropEnter: this.onDropEnter,
            onDropDone: this.onDropDone,
          }
        }],
      }));
    }
    return c('div', {
      staticClass: `eb-layout-sidebar-tabs`,
    }, tabs);
  },
  props: {
    side: {
      type: String,
    }
  },
  data() {
    return {
      dragdropScene: Vue.prototype.$meta.util.nextId('dragdrop'),
    }
  },
  computed: {
    layout() {
      return this.sidebar.layout;
    },
    sidebar() {
      return this.$parent;
    },
    panels() {
      return this.sidebar.options.panels;
    },
  },
  methods: {
    onClickTab(event, panel) {
      event.stopPropagation();
      event.preventDefault();
      this.sidebar.createView({ ctx: null, panel });
    },
    onDragElement({ $el, context }) {},
    onDropElement({ $el, context, dragElement, dragConext }) {},
    onDropLeave({ $el, context, dropElement }) {},
    onDropEnter({ $el, context, dropElement }) {},
    onDropDone({ $el, context, dropElement, dropContext }) {},
  }
}

</script>
