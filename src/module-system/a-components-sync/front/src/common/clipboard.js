import ClipboardJS from 'clipboard';
export default {
  data() {
    return {
      clipboards: {},
    };
  },
  beforeDestroy() {
    for (const clipboardId in this.clipboards) {
      this.removeClipboardTrigger(clipboardId);
    }
    this.clipboards = {};
  },
  methods: {
    addClipboardTrigger(el, options) {
      // clipboard
      const clipboard = new ClipboardJS(el, options);
      clipboard.on('success', () => {
        this.$view.toast.show({ text: this.$text('Copied') });
      });
      // store
      const clipboardId = this.$meta.util.nextId('clipboard');
      this.clipboards[clipboardId] = clipboard;
      return clipboardId;
    },
    removeClipboardTrigger(clipboardId) {
      const clipboard = this.clipboards[clipboardId];
      if (clipboard) {
        clipboard.destroy();
        delete this.clipboards[clipboardId];
      }
    },
  },

};

