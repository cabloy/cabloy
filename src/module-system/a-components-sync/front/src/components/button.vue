<script>
import Vue from 'vue';
import perform from '../common/perform.js';
const f7Button = Vue.options.components.f7Button;
export default {
  name: 'eb-button',
  extends: f7Button,
  mixins: [ perform ],
};

</script>
<style scoped>


</style>
