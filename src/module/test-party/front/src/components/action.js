import ActionPartyOver from './action/actionPartyOver.js';
import ActionPartyOverBulk from './action/actionPartyOverBulk.js';

export default {
  meta: {
    global: false,
  },
  mixins: [
    ActionPartyOver, //
    ActionPartyOverBulk,
  ],
  props: {
    ctx: {
      type: Object,
    },
    action: {
      type: Object,
    },
    item: {
      type: Object,
    },
  },
  methods: {
    async onAction() {
      if (this.action.name === 'partyOver') {
        return await this._onActionPartyOver();
      } else if (this.action.name === 'partyOverBulk') {
        return await this._onActionPartyOverBulk();
      }
    },
  },
};
