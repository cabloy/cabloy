import Vue from 'vue';
import perform from '../common/perform.js';
const f7FabButton = Vue.options.components['f7-fab-button'].extendOptions;
export default {
  meta: {
    global: true,
  },
  name: 'eb-fab-button',
  extends: f7FabButton,
  mixins: [perform],
};
