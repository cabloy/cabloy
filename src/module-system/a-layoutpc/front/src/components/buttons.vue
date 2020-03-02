<script>
import Vue from 'vue';
export default {
  render(c) {
    const children = [];
    // more
    if (this.layout.groups.length > 2) {
      children.push(c('f7-link', {
        props: {
          iconMaterial: 'expand_more',
          popoverOpen: `#${this.popoverId}`,
        },
      }));
    }
    // buttons
    for (const button of this.$config.layout.header.buttons) {
      const props = {
        iconMaterial: button.iconMaterial,
      };
      children.push(c('eb-link', {
        key: button.name,
        props,
        nativeOn: {
          click: event => {
            this.layout.navigate(button.url, { scene: button.scene, sceneOptions: button.sceneOptions });
            event.stopPropagation();
            event.preventDefault();
          },
        },
      }));
    }
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
    return c('div', children);
  },
  data() {
    return {
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
};

</script>
<style scoped>
</style>
