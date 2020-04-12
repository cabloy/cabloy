<script>
export default {
  render(c) {
    const children = [];
    for (const group of this.layout.groups) {
      const text = c('span', { domProps: { innerText: group.title } });
      const close = c('f7-icon', {
        staticClass: 'close',
        attrs: { material: 'close' },
        nativeOn: {
          click: event => {
            this.groups.removeGroup(group.id);
            event.stopPropagation();
            event.preventDefault();
          },
        },
      });
      children.push(c('eb-link', {
        ref: group.id,
        key: group.id,
        attrs: { tabLink: `#${group.id}` },
        props: {
          onPerform: () => {
            this.groups.switchGroup(group.id);
          },
        },
        directives: [{
          name: 'eb-dragdrop',
          value: {
            scene: this.dragdropScene,
            group,
            onDragStart: this.onDragStart,
            onDropElement: this.onDropElement,
            onDragDone: this.onDragDone,
          }
        }],
      }, [text, close]));
    }
    const toolbar = c('f7-toolbar', {
      ref: 'toolbar',
      attrs: { top: true, tabbar: true, scrollable: true },
    }, children);
    return toolbar;
  },
  data() {
    return {
      dragdropScene: Vue.prototype.$meta.util.nextId('dragdrop'),
    }
  },
  computed: {
    layout() {
      return this.$parent.$parent;
    },
    groups() {
      return this.layout.$refs.groups;
    },
  },
  methods: {
    isTabActive(groupId) {
      return this.$$(this.$refs[groupId].$el).hasClass('tab-link-active');
    },
    onDragStart({ $el, context, dragElement }) {
      const [group, groupIndexDrag] = this.groups._getGroupAndIndex(context.group.id);
      const tooltip = group.title;
      return { tooltip };
    },
    onDropElement({ $el, context, dragElement, dragContext }) {
      const [groupDrop, groupIndexDrop] = this.groups._getGroupAndIndex(context.group.id);
      const [groupDrag, groupIndexDrag] = this.groups._getGroupAndIndex(dragContext.group.id);
      if (groupIndexDrop === groupIndexDrag || groupIndexDrop == groupIndexDrag + 1) return null;
      // dropElement
      const dropElement = $el;
      // tooltip
      const tooltip = groupDrop.title;
      // ok
      return { dropElement, tooltip };
    },
    onDragDone({ $el, context, dragElement, dropElement, dropContext }) {
      const groupIndexDrag = this.groups._getGroupIndex(context.group.id);
      this.layout.groups.splice(groupIndexDrag, 1);
      const groupIndexDrop = this.groups._getGroupIndex(dropContext.group.id);
      this.layout.groups.splice(groupIndexDrop, 0, context.group);
    },
  },
};

</script>
<style scoped>
</style>
