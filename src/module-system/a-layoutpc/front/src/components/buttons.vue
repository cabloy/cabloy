<script>
import Vue from 'vue';
export default {
  render(c) {
    const children = [];
    // more
    if (this.groups.length > 2) {
      children.push(c('eb-link', {
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
        ebHref: button.url,
        ebTarget: button.target,
      };
      children.push(c('eb-link', { key: button.name, props }));
    }
    // popover
    const tabButtons = [];
    for (const group of this.groups) {
      tabButtons.push(c('eb-list-item', {
        key: group.id,
        props: {
          popoverClose: true,
          ebHref: group.url,
          title: group.title,
        },
      }));
    }
    const tabList = c('f7-list', { attrs: { inset: true } }, tabButtons);
    children.push(c('f7-popover', { attrs: { id: this.popoverId } }, [ tabList ]));
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
      return this.layout.groups;
    },
  },
};

</script>
<style scoped>


</style>
