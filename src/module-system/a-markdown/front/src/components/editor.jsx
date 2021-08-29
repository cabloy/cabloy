// import { schema } from 'prosemirror-schema-basic';
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { undo, redo, history } from 'prosemirror-history';
import { keymap } from 'prosemirror-keymap';
import { baseKeymap } from 'prosemirror-commands';
import { schema, defaultMarkdownParser, defaultMarkdownSerializer } from 'prosemirror-markdown';
import { exampleSetup } from 'prosemirror-example-setup';
import { speckle } from '../common/plugins/speckle.js';
import { ButtonsDefault } from '../common/buttons.js';

export default {
  meta: {
    global: false,
  },
  props: {
    value: {
      type: String,
    },
    buttons: {
      type: Array,
    },
    mode: {
      type: String,
      default: 'toolbar',
    },
  },
  data() {
    return {
      lastValue: this.value,
    };
  },
  watch: {
    value(newValue) {
      if (newValue === this.lastValue) return;
      this.lastValue = newValue;
      const state = this._createState(this.lastValue);
      this.view.updateState(state);
    },
  },
  mounted() {
    const state = this._createState(this.lastValue);
    this.view = this._createView(state);
  },
  beforeDestroy() {
    this.view = null;
  },
  methods: {
    _createState(value) {
      const state = EditorState.create({
        schema,
        doc: defaultMarkdownParser.parse(value),
        // plugins: exampleSetup({ schema }),
        plugins: [
          speckle(),
          history(), //
          keymap({ 'Mod-z': undo, 'Mod-y': redo }),
          keymap(baseKeymap),
        ],
      });
      return state;
    },
    _createView(state) {
      const view = new EditorView(this.$el, {
        state,
        dispatchTransaction: transaction => {
          return this._viewDispatchTransaction(view, transaction);
        },
      });
      return view;
    },
    _viewDispatchTransaction(view, transaction) {
      console.log('Document size went from', transaction.before.content.size, 'to', transaction.doc.content.size);
      const newState = view.state.apply(transaction);
      view.updateState(newState);
      const mdValue = defaultMarkdownSerializer.serialize(newState.doc);
      if (this.lastValue !== mdValue) {
        this.lastValue = mdValue;
        this.$emit('input', this.lastValue);
      }
    },
    _renderButtons(buttonsWant) {
      return null;
    },
    _renderToolbar() {
      if (this.mode !== 'toolbar') return null;
      const domButtons = this._renderButtons(this.buttons || ButtonsDefault);
      return <div class="text-editor-toolbar">{domButtons}</div>;
    },
  },
  render() {
    const domToolbar = this._renderToolbar();
    return <div class="text-editor">{domToolbar}</div>;
  },
};
