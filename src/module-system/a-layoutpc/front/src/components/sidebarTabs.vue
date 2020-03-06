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
            panel,
            onDragStart: this.onDragStart,
            onDragElement: this.onDragElement,
            onDropElement: this.onDropElement,
            onDropLeave: this.onDropLeave,
            onDropEnter: this.onDropEnter,
            onDragEnd: this.onDragEnd,
            onDragDone: this.onDragDone,
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
    onDragStart({ $el, context, dragElement }) {},
    onDragElement({ $el, context }) {},
    onDropElement({ $el, context, dragElement, dragConext }) {
      const panelIndexDrop = this.sidebar._getPanelIndex(context.panel);
      const panelIndexDrag = this.sidebar._getPanelIndex(dragConext.panel);
      if (panelIndexDrop === panelIndexDrag || panelIndexDrop == panelIndexDrag + 1) return null;
      return $el;
    },
    onDropLeave({ $el, context, dropElement }) {},
    onDropEnter({ $el, context, dropElement }) {},
    onDragEnd({ $el, context, dragElement }) {},
    onDragDone({ $el, context, dragElement, dropElement, dropContext }) {
      const panelIndexDrag = this.sidebar._getPanelIndex(context.panel);
      this.panels.splice(panelIndexDrag, 1);
      const panelIndexDrop = this.sidebar._getPanelIndex(dropContext.panel);
      this.panels.splice(panelIndexDrop, 0, context.panel);
      // save
      this.layout.__saveLayoutConfig();
    },
  }
}

</script>
