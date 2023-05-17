import clipboard from 'copy-to-clipboard';

export default {
  state() {
    return {};
  },
  actions: {
    copy(text, options) {
      const ctx = options && options.ctx;
      const res = clipboard(text, options);
      if (res && ctx) {
        ctx.$view.toast.show({ text: ctx.$text('Copied') });
      }
    },
  },
};
