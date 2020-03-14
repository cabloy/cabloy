<script>
import Vue from 'vue';
import perform from '../common/perform.js';
const f7ListButton = Vue.options.components['f7-list-button'].extendOptions;
export default {
  meta: {
    global: true,
  },
  name: 'eb-list-button',
  extends: f7ListButton,
  mixins: [perform],
};

</script>
<style scoped>
</style>
