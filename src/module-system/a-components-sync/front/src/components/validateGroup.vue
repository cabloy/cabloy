<script>
import validateItem from '../common/validateItem.js';

export default {
  meta: {
    global: true,
  },
  name: 'eb-list-group-validate',
  mixins: [ validateItem ],
  render(c) {
    return this.renderItem(c);
  },
};

</script>
<style scoped>
</style>
