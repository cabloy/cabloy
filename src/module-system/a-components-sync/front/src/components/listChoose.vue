<script>
import Vue from 'vue';
import validate from '../common/validate.js';
const f7ListItem = Vue.options.components['f7-list-item'].extendOptions;
export default {
  name: 'eb-list-item-choose',
  extends: f7ListItem,
  mixins: [ validate ],
  props: {
    onChoose: {
      type: Function,
    },
    context: {},
  },
  methods: {
    onValidateError(error) {
      const panel = this.$$(this.$el);
      if (error) {
        panel.addClass('item-choose-invalid');
      } else {
        panel.removeClass('item-choose-invalid');
      }
    },
    onClick(event) {
      event.stopPropagation();
      event.preventDefault();
      this.$emit('click', event);
      if (!this.onChoose) return;
      const res = this.onChoose(event, this.context);
      if (this.$meta.util.isPromise(res)) {
        res.then(data => {
          if (data) this.clearValidateError();
        });
      } else if (res) {
        this.clearValidateError();
      }
    },
  },

};

</script>
<style scoped>


</style>
