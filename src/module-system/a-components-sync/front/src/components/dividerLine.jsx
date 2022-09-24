export default {
  meta: {
    global: true,
  },
  name: 'eb-divider-line',
  props: {
    text: {
      type: String,
    },
  },
  render() {
    return (
      <div class="eb-divider-line">
        <div class="text">{this.text}</div>
      </div>
    );
  },
};
