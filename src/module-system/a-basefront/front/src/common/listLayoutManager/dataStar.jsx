export default {
  methods: {
    dataStar_onSwitch(event, item) {
      const star = item.star ? 0 : 1;
      return this.dataStar_onSwitch2(event, item, star, 'swipeoutClose');
    },
  },
};
