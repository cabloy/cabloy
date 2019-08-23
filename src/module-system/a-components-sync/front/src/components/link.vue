<script>
import Vue from 'vue';
import perform from '../common/perform.js';
import link from '../common/link.js';
const f7Link = Vue.options.components['f7-link'].extendOptions;
delete f7Link.props.href;
export default {
  name: 'eb-link',
  extends: f7Link,
  mixins: [ perform, link ],
  methods: {
    getLinkEl() {
      return this.$$(this.$el);
    },
  },
};

</script>
<style scoped>
</style>
