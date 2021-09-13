export default {
  meta: {
    global: true,
  },
  name: 'eb-json-editor',
  props: {
    value: {
      type: String,
    },
    readOnly: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      content: this.value,
    };
  },
  created() {},
  mounted() {
    this.mountCodeMirror();
  },
  beforeDestroy() {
    if (this.cmEditor) {
      this.cmEditor._handlers = {};
      this.cmEditor = null;
    }
  },
  methods: {
    async mountCodeMirror() {
      // codemirror
      await this.$meta.module.use('a-codemirror');
      // mode
      const modeInfo = window.CodeMirror.__findMode('json');
      await window.CodeMirror.__loadMode(modeInfo.mode);
      // addon
      await window.CodeMirror.__loadAddon('fold', ['foldcode', 'foldgutter', 'brace-fold'], ['foldgutter']);
      // create
      this.cmEditor = window.CodeMirror(this.$refs.json, {
        value: this.content,
        mode: modeInfo.mode,
        lineNumbers: true,
        indentUnit: 2,
        tabSize: 2,
        lineWrapping: false,
        foldGutter: true,
        gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
        extraKeys: this.codeMirrorKeymap(),
        readOnly: this.readOnly,
      });
      // event
      this.cmEditor.on('changes', () => {
        this.onChanges();
      });
    },
    codeMirrorKeymap() {
      const mod = /Mac/.test(navigator.platform) ? 'Cmd' : 'Ctrl';
      return window.CodeMirror.normalizeKeyMap({
        [`${mod}-S`]: () => {
          this.$emit('save');
        },
        Tab: cm => {
          if (cm.somethingSelected()) {
            cm.indentSelection('add');
          } else {
            cm.replaceSelection(Array(cm.getOption('indentUnit') + 1).join(' '), 'end', '+input');
          }
        },
        'Shift-Tab': cm => {
          if (cm.somethingSelected()) {
            cm.indentSelection('subtract');
          } else {
            const cursor = cm.getCursor();
            cm.setCursor({ line: cursor.line, ch: cursor.ch - 4 });
          }
        },
      });
    },
    onChanges() {
      if (this.readOnly) return;
      const value = this.cmEditor.getValue();
      if (this.content !== value) {
        this.content = value;
        this.$emit('input', this.content);
      }
    },
    parseValue(valueType) {
      // string
      if (valueType === 'string') {
        return this.content ? JSON.stringify(window.JSON5.parse(this.content)) : null;
      }
      // object
      return this.content ? window.JSON5.parse(this.content) : null;
    },
  },
  render() {
    return <div ref="json" class="eb-json-editor-codemirror"></div>;
  },
};
