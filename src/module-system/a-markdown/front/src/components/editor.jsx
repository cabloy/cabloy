// import { schema } from 'prosemirror-schema-basic';
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { undo, redo, history } from 'prosemirror-history';
import { keymap } from 'prosemirror-keymap';
import { baseKeymap } from 'prosemirror-commands';
import { schema, defaultMarkdownParser, defaultMarkdownSerializer } from 'prosemirror-markdown';
// import { exampleSetup } from 'prosemirror-example-setup';
import { speckle } from '../common/plugins/speckle.js';

export default {
  meta: {
    global: false,
  },
  data() {
    return {
      content: '## hello world',
    };
  },
  mounted() {
    const state = EditorState.create({
      schema,
      doc: defaultMarkdownParser.parse(this.content),
      plugins: [
        speckle(),
        history(), //
        keymap({ 'Mod-z': undo, 'Mod-y': redo }),
        keymap(baseKeymap),
      ],
    });
    const view = new EditorView(this.$el, {
      state,
      dispatchTransaction(transaction) {
        console.log('Document size went from', transaction.before.content.size, 'to', transaction.doc.content.size);
        const newState = view.state.apply(transaction);
        view.updateState(newState);
      },
    });
  },
  methods: {},
  render() {
    return <div></div>;
  },
};
