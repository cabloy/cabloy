<script>
import Vue from 'vue';
import validateCheck from '../common/validate/validateCheck.js';
const f7Input = Vue.options.components['f7-input'].extendOptions;
export default {
  meta: {
    global: true,
  },
  name: 'eb-input',
  extends: f7Input,
  mixins: [validateCheck],
};
</script>
<style scoped></style>
