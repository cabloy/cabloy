export default {
  props: {
    providerModule: {
      type: String,
    },
    providerName: {
      type: String,
    },
    providerScene: {
      type: String,
    },
  },
  methods: {
    combineLoginUrl() {
      return this.$meta.util.combineLoginUrl({
        providerModule: this.providerModule,
        providerName: this.providerName,
        providerScene: this.providerScene,
      });
    },
  },
};
