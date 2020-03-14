<script>
import Vue from 'vue';
import validate from '../common/validate.js';
const f7ListItem = Vue.options.components['f7-list-item'].extendOptions;
export default {
  meta: {
    global: true,
  },
  name: 'eb-list-item-panel',
  extends: f7ListItem,
  mixins: [validate],
  methods: {
    onValidateError(error) {
      const panel = this.$$(this.$el);
      if (error) {
        panel.addClass('item-panel-invalid');
      } else {
        panel.removeClass('item-panel-invalid');
      }
    },
  },
};

</script>
<style scoped>
</style>
