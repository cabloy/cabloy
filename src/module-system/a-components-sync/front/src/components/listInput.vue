<script>
import Vue from 'vue';
import validateCheck from '../common/validate/validateCheck.js';
const f7ListInput = Vue.options.components['f7-list-input'].extendOptions;
export default {
  meta: {
    global: true,
  },
  name: 'eb-list-input',
  extends: f7ListInput,
  mixins: [validateCheck],
};
</script>
<style scoped></style>
