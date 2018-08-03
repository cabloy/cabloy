<script>
import Vue from 'vue';
import perform from '../common/perform.js';
import link from '../common/link.js';
const f7ListItem = Vue.options.components['f7-list-item'].extendOptions;
delete f7ListItem.props.href;
export default {
  name: 'eb-list-item',
  extends: f7ListItem,
  mixins: [ perform, link ],
};

</script>
<style scoped>


</style>
