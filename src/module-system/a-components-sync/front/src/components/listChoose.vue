<script>
import Vue from 'vue';
import validate from '../common/validate/validateCheck.js';
import trimMessage from '../common/trimMessage.js';
const f7ListItem = Vue.options.components['f7-list-item'].extendOptions;
export default {
  meta: {
    global: true,
  },
  name: 'eb-list-item-choose',
  extends: f7ListItem,
  mixins: [validate],
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
      this._onPerformChoose();
    },
    async _onPerformChoose(event) {
      if (!this.onChoose) return;
      try {
        const res = await this.onChoose(event, this.context);
        if (res) {
          this.clearValidateError();
        }
      } catch (err) {
        if (err && err.code !== 401 && err.message) {
          this.$view.toast.show({ text: trimMessage(this, err.message) });
        }
      }
    },
  },
};
</script>
