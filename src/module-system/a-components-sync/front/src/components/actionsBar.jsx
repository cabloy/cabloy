export default {
  meta: {
    global: true,
  },
  name: 'eb-actions-bar',
  props: {
    mode: {}, // toolbar/swipeout/menu
  },
  methods: {
    getMode() {
      if (this.mode) return this.mode;
      return this.$device.desktop ? 'menu' : 'swipeout';
    },
  },
  render() {
    return <div>sssss</div>;
  },
};
