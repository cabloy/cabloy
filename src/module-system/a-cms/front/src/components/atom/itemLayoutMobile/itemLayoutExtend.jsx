export default {
  props: {
    layoutManager: {
      type: Object,
    },
  },
  data() {
    return {};
  },
  methods: {
    async onActionSaveBefore({ item }) {
      throw new Error('ssss');
    },
  },
};
