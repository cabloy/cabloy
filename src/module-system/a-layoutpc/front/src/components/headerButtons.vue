<script>
import Vue from 'vue';
import HeaderButton from './headerButton.vue';
export default {
  components: {
    ebHeaderButton: HeaderButton,
  },
  render(c) {
    const children = [];
    if (this.side === 'top') {
      // more
      children.push(
        c('eb-link', {
          key: 'expand_more',
          staticClass: this.layout.size.verySmall || this.layout.groups.length > 2 ? '' : 'display-none',
          props: {
            iconMaterial: 'expand_more',
            onPerform: event => {
              return this.onPerformExpandMore(event);
            },
          },
        })
      );
    }
    // buttons
    for (const button of this.buttons) {
      children.push(
        c('eb-header-button', {
          key: this.layout._buttonFullName(button),
          props: {
            options: button,
            dragdropScene: this.dragdropScene,
          },
        })
      );
    }
    // ok
    return c('div', {}, children);
  },
  props: {
    side: {
      type: String,
    },
    buttons: {
      type: Array,
    },
  },
  data() {
    return {
      buttonsReal: {},
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
    _getButtonIndex(button) {
      return this.buttons.findIndex(item => this.layout._buttonFullName(item) === this.layout._buttonFullName(button));
    },
    _getButtonAndIndex(button) {
      const buttonIndex = this._getButtonIndex(button);
      if (buttonIndex === -1) return [null, -1];
      return [this.buttons[buttonIndex], buttonIndex];
    },
    async onPerformExpandMore(event) {
      // buttons
      const buttons = [];
      for (const group of this.layout.groups) {
        buttons.push({
          text: group.title,
          data: group,
        });
      }
      // choose
      const params = {
        targetEl: event.target,
        buttons,
      };
      if (buttons.length > 8) {
        Object.assign(params, {
          grid: true,
          forceToPopover: false,
          convertToPopover: false,
        });
      } else {
        Object.assign(params, {
          forceToPopover: true,
        });
      }
      const button = await this.$meta.vueLayout.appMethods.actions.choose(params);
      this.groups.switchGroup(button.data.id);
    },
  },
};
</script>
<style scoped></style>
