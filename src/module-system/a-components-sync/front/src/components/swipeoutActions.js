import Vue from 'vue';
const f7SwipeoutActions = Vue.options.components['f7-swipeout-actions'].extendOptions;
export default {
  meta: {
    global: true,
  },
  name: 'eb-swipeout-actions',
  extends: f7SwipeoutActions,
  props: {
    ready: {
      type: Boolean,
      default: true,
    },
  },
  watch: {
    ready(value) {
      if (value) {
        this.$nextTick(() => {
          this.showActions();
        });
      }
    },
  },
  methods: {
    showActions() {
      const el = this.$$(this.$el);
      if (!el.hasClass('swipeout-actions-opened')) return;

      const right = el.hasClass('swipeout-actions-right');
      const width = el.outerWidth();
      const newTranslate = right ? -width : width;
      const buttons = el.children('a');
      if (buttons) {
        for (let i = 0; i < buttons.length; i++) {
          this.$$(buttons[i]).transform(`translate3d(${newTranslate}px,0,0)`);
        }
      }
    },
  },
};
