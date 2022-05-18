<script>
import Vue from 'vue';

// Refresh / Close /  Close Other Tabs / Close Tabs to the Right
const __tabContextMenuButtons = [
  { name: 'refresh', text: 'Refresh' }, //
  { name: 'close', text: 'Close' },
  { name: 'closeOtherTabs', text: 'CloseOtherTabs' },
  { name: 'closeTabsToTheRight', text: 'CloseTabsToTheRight' },
];
export default {
  render(c) {
    const children = [];
    for (const group of this.layout.groups) {
      const close = c('f7-icon', {
        staticClass: 'close',
        props: { f7: '::close', size: '16' },
        nativeOn: {
          click: event => {
            event.stopPropagation();
            event.preventDefault();
            this.onClickClose(group);
          },
        },
      });
      const groupIcon = this._getGroupIcon(group);
      const groupBadge = this._getGroupBadge(group);
      children.push(
        c(
          'eb-link',
          {
            ref: group.id,
            key: group.id,
            attrs: {
              tabLink: `#${group.id}`,
              iconSize: 16,
              iconF7: groupIcon && groupIcon.f7,
              iconBadge: groupIcon && groupIcon.badge,
              badge: groupBadge && groupBadge.text,
              text: group.title,
            },
            props: {
              onPerform: event => {
                this.onPerformTabClick(event, group.id);
              },
            },
            directives: [
              {
                name: 'eb-dragdrop',
                value: {
                  scene: this.dragdropScene,
                  group,
                  onDragStart: this.onDragStart,
                  onDropElement: this.onDropElement,
                  onDragDone: this.onDragDone,
                },
              },
            ],
            nativeOn: {
              contextmenu: event => {
                this.onContextMenu(event, group.id);
              },
            },
          },
          [close]
        )
      );
    }
    const toolbar = c(
      'f7-toolbar',
      {
        ref: 'toolbar',
        attrs: { top: true, tabbar: true, scrollable: true },
      },
      children
    );
    return toolbar;
  },
  data() {
    return {
      dragdropScene: Vue.prototype.$meta.util.nextId('dragdrop'),
    };
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
    _getGroupIcon(group) {
      return this.$meta.util.getProperty(group, 'sceneOptions.resourceConfig.icon');
    },
    _getGroupBadge(group) {
      return this.$meta.util.getProperty(group, 'sceneOptions.resourceConfig.badge');
    },
    async _onContextMenuItemClick_refresh(groupId) {
      await this.groups.refreshGroup(groupId);
    },
    async _onContextMenuItemClick_close(groupId) {
      await this.groups.closeGroup(groupId, false);
    },
    async _onContextMenuItemClick_closeOtherTabs(groupId) {
      await this.groups.closeOtherTabs(groupId);
    },
    async _onContextMenuItemClick_closeTabsToTheRight(groupId) {
      await this.groups.closeTabsToTheRight(groupId);
    },
    onDragStart({ /* $el,*/ context /* , dragElement*/ }) {
      const [group] = this.groups._getGroupAndIndex(context.group.id);
      const tooltip = group.title;
      return { tooltip };
    },
    onDropElement({ $el, context, /* dragElement,*/ dragContext }) {
      const [groupDrop, groupIndexDrop] = this.groups._getGroupAndIndex(context.group.id);
      const [, /* groupDrag*/ groupIndexDrag] = this.groups._getGroupAndIndex(dragContext.group.id);
      if (groupIndexDrop === groupIndexDrag || groupIndexDrop === groupIndexDrag + 1) return null;
      // dropElement
      const dropElement = $el;
      // tooltip
      const tooltip = groupDrop.title;
      // ok
      return { dropElement, tooltip };
    },
    onDragDone({ /* $el,*/ context, /* dragElement, dropElement,*/ dropContext }) {
      const groupIndexDrag = this.groups._getGroupIndex(context.group.id);
      this.layout.groups.splice(groupIndexDrag, 1);
      const groupIndexDrop = this.groups._getGroupIndex(dropContext.group.id);
      this.layout.groups.splice(groupIndexDrop, 0, context.group);
    },
    async onClickClose(group) {
      await this.groups.closeGroup(group.id, false);
    },
    onPerformTabClick(event, groupId) {
      // check if currrent
      if (this.groups.groupIdCurrent !== groupId) {
        this.groups.switchGroup(groupId);
      } else if (!this.$device.desktop) {
        this._showContextMenu(event, groupId);
      }
    },
    onContextMenu(event, groupId) {
      event.stopPropagation();
      event.preventDefault();
      if (!this.$device.desktop) return;
      this.$nextTick(() => {
        this._showContextMenu(event, groupId);
      });
    },
    // Refresh / Close /  Close Other Tabs / Close Tabs to the Right
    async _showContextMenu(event, groupId) {
      try {
        // buttons
        const buttons = [];
        for (const item of __tabContextMenuButtons) {
          buttons.push({
            text: this.$text(item.text),
            data: item,
          });
        }
        // choose
        const params = {
          forceToPopover: true,
          targetEl: event.currentTarget,
          buttons,
        };
        const button = await this.$meta.vueLayout.appMethods.actions.choose(params);
        const handlerName = `_onContextMenuItemClick_${button.data.name}`;
        this[handlerName](groupId);
      } catch (err) {
        if (err.message) throw err;
      }
    },
  },
};
</script>
<style scoped></style>
