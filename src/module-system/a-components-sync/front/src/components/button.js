import Vue from 'vue';
import perform from '../common/perform.js';
import contextMenu from '../common/contextMenu.js';
const f7Button = Vue.options.components['f7-button'].extendOptions;
export default {
  meta: {
    global: true,
  },
  name: 'eb-button',
  extends: f7Button,
  mixins: [perform, contextMenu],
};
