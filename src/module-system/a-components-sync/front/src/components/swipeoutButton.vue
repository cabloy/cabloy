<script>
import Vue from 'vue';
import perform from '../common/perform.js';
const f7SwipeoutButton = Vue.options.components.f7SwipeoutButton;
export default {
  name: 'eb-swipeout-button',
  extends: f7SwipeoutButton,
  mixins: [ perform ],
};

</script>
<style scoped>


</style>
