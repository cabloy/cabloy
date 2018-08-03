<script>
import Vue from 'vue';
import perform from '../common/perform.js';
const f7FabButton = Vue.options.components['f7-fab-button'].extendOptions;
export default {
  name: 'eb-fab-button',
  extends: f7FabButton,
  mixins: [ perform ],
};

</script>
<style scoped>


</style>
