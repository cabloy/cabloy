import Base from './base.jsx';

export default {
  mixins: [Base],
  methods: {
    async index_load() {
      const res = await this.base_loadData();
      if (!res) return;
      this.base.ready = true;
    },
  },
};
