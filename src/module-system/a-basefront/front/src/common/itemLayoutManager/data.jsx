export default {
  data() {
    return {
      data: {
        provider: {},
      },
    };
  },
  methods: {
    async data_provider_onLoadItem() {
      await this.base_loadItem();
      return this.base.item;
    },
  },
};
