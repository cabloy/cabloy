<script>
import validate from '../common/validate.js';
import ebListItem from './listItem.vue';
export default {
  name: 'eb-list-item-choose',
  extends: ebListItem,
  mixins: [ validate ],
  methods: {
    onValidateError(error) {
      const panel = this.$$(this.$el);
      if (error) {
        panel.addClass('item-choose-invalid');
      } else {
        panel.removeClass('item-choose-invalid');
      }
    },
  },
};

</script>
<style scoped>


</style>
