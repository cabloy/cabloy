import clipboard from 'copy-to-clipboard';

export default function (/* Vue*/) {
  return {
    copy(text, options) {
      const ctx = options && options.ctx;
      const res = clipboard(text, options);
      if (res && ctx) {
        ctx.$view.toast.show({ text: ctx.$text('Copied') });
      }
    },
  };
}
