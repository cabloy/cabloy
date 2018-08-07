<script>
import Vue from 'vue';
const f7Popover = Vue.options.components['f7-popover'].extendOptions;
export default {
  name: 'eb-popover',
  extends: f7Popover,
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
          this.resize();
        });
      }
    },
  },
  methods: {
    resize() {
      const el = this.$$(this.$el);
      if (!el.hasClass('modal-in')) return;
      this.f7Popover.resize();
    },
  },
};

</script>
<style scoped>


</style>
