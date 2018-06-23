<script>
import Vue from 'vue';
import perform from '../common/perform.js';
const f7ListButton = Vue.options.components.f7ListButton;
export default {
  name: 'eb-list-button',
  extends: f7ListButton,
  mixins: [ perform ],
};

</script>
<style scoped>


</style>
