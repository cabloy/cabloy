export default {
  meta: {
    global: true,
  },
  name: 'eb-json-editor',
  props: {
    value: {},
    valueType: {},
    valueMode: {
      type: String,
      default: 'json',
    },
    readOnly: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      content: this.parseValue(this.value),
    };
  },
  computed: {
    valueType2() {
      const type = this.valueType;
      if (type && Array.isArray(type)) return type[0];
      return type || 'string';
    },
  },
  watch: {
    value(newValue) {
      const _newValue = this.parseValue(newValue);
      if (_newValue === this.content) return;
      this.content = _newValue;
      this.cmEditor.setValue(this.content);
    },
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
      const modeInfo = window.CodeMirror.__findMode(this.valueMode);
      await window.CodeMirror.__loadMode(modeInfo.mode);
      // addon
      await window.CodeMirror.__loadAddon('fold', ['foldcode', 'foldgutter', 'brace-fold'], ['foldgutter']);
      // create
      this.cmEditor = window.CodeMirror(this.$refs.editorContainer, {
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
        this._raiseEventInput();
      }
    },
    _raiseEventInput() {
      try {
        // not raise event if json.parse error
        this.$emit('input', this.getValue());
      } catch (err) {}
    },
    parseValue(value) {
      if (this.valueMode !== 'json') return value;
      let content;
      // value
      if (!value) {
        content = '{}';
      } else {
        if (typeof value === 'string') {
          content = window.JSON5.stringify(window.JSON5.parse(value), null, 2);
        } else {
          content = window.JSON5.stringify(value, null, 2);
        }
      }
      return content;
    },
    getValue() {
      if (this.valueMode !== 'json') return this.content;
      // string
      if (this.valueType2 === 'string') {
        return this.content ? JSON.stringify(window.JSON5.parse(this.content)) : null;
      }
      // object
      return this.content ? window.JSON5.parse(this.content) : null;
    },
  },
  render() {
    return <div ref="editorContainer" class="eb-json-editor-codemirror"></div>;
  },
};
