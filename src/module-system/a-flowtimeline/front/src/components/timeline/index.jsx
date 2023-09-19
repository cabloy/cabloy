import Base from './base.jsx';
import Info from './info.jsx';
import Timeline from './timeline.jsx';
import Event from './event.js';
import Notification from './notification.jsx';

export default {
  mixins: [Base, Info, Timeline, Event, Notification],
  props: {
    adapter: {
      type: Object,
    },
  },
  methods: {
    async index_load() {
      const res = await this.base_loadData();
      if (!res) return false;
      this.base.ready = true;
      return true;
    },
  },
};
