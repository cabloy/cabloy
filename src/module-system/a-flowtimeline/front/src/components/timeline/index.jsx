import Base from './base.jsx';
import Timeline from './timeline.jsx';

export default {
  mixins: [Base, Timeline],
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
