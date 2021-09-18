import validateItem from '../common/validate/validateItem.jsx';

export default {
  meta: {
    global: true,
  },
  name: 'eb-list-item-validate',
  mixins: [validateItem],
  render() {
    if (this.root) {
      return this.renderRoot();
    }
    return this.renderItem();
  },
};
