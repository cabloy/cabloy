<script>
import HeaderButton from './headerButton.vue';

import Vue from 'vue';
export default {
  components: {
    ebHeaderButton: HeaderButton,
  },
  render(c) {
    const children = [];
    // more
    children.push(c('f7-link', {
      staticClass: (this.layout.size.verySmall || this.layout.groups.length > 2) ? '' : 'display-none',
      props: {
        iconMaterial: 'expand_more',
        popoverOpen: `#${this.popoverId}`,
      },
    }));
    // popover
    const tabButtons = [];
    for (const group of this.layout.groups) {
      tabButtons.push(c('eb-list-item', {
        key: group.id,
        props: {
          link: "#",
          popoverClose: true,
          title: group.title,
        },
        on: {
          click: event => {
            this.groups.switchGroup(group.id);
          },
        },
      }));
    }
    const tabList = c('f7-list', { attrs: { inset: true } }, tabButtons);
    children.push(c('f7-popover', { attrs: { id: this.popoverId } }, [tabList]));
    // buttons
    for (const button of this.buttons) {
      children.push(c('eb-header-button', {
        key: this.layout._buttonFullName(button),
        props: {
          options: button,
          dragdropScene: this.dragdropScene,
        },
      }));
    }
    // ok
    return c('div', children);
  },
  props: {
    buttons: {
      type: Array,
    },
  },
  data() {
    return {
      buttonsReal: {},
      dragdropScene: Vue.prototype.$meta.util.nextId('dragdrop'),
      popoverId: Vue.prototype.$meta.util.nextId('popover'),
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
    _getButtonIndex(button) {
      return this.buttons.findIndex(item => this.layout._buttonFullName(item) === this.layout._buttonFullName(button));
    },
    _getButtonAndIndex(button) {
      const buttonIndex = this._getButtonIndex(button);
      if (buttonIndex === -1) return [null, -1];
      return [this.buttons[buttonIndex], buttonIndex];
    },
  },
};

</script>
<style scoped>
</style>
