<script>
import Vue from 'vue';
const f7List = Vue.options.components['f7-list'].extendOptions;
export default {
  meta: {
    global: true,
  },
  name: 'eb-list',
  extends: f7List,
  mounted() {
    const form = this.getForm();
    if (form) {
      // append input[type=submit] after the ul element if not found
      let input = this.getInputSubmit();
      if (input.length === 0) {
        input = this.$$('<input type="submit" value="" style="width:0;height:0;border:0;padding:0;" />');
        form.append(input);
      }
      // on
      input.on('click', this.onSubmit);
    }
  },
  beforeDestroy() {
    const input = this.getInputSubmit();
    if (input) {
      input.off('click', this.onSubmit);
    }
  },
  methods: {
    onSubmit(event) {
      event.preventDefault();
      this.$emit('submit', event);
    },
    getForm() {
      if (!this.form) return null;
      const self = this.$$(this.$el);
      if (self.is('form')) return self;
      const form = self.find('form');
      return form.length === 1 ? form : null;
    },
    getInputSubmit() {
      const form = this.getForm();
      if (!form) return null;
      return form.find('input[type=submit]');
    },
  },
};

</script>
<style scoped>
</style>
