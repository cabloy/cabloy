<script>
import validateItem from '../common/validate/validateItem.js';

export default {
  meta: {
    global: true,
  },
  name: 'eb-list-item-validate',
  mixins: [validateItem],
  render(c) {
    if (this.root) {
      return this.renderRoot(c);
    }
    return this.renderItem(c);
  },
};
</script>
<style scoped></style>
