// import { schema } from 'prosemirror-schema-basic';
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { history } from 'prosemirror-history';
import { keymap } from 'prosemirror-keymap';
import { baseKeymap } from 'prosemirror-commands';
import { dropCursor } from 'prosemirror-dropcursor';
import { gapCursor } from 'prosemirror-gapcursor';
import { buildInputRules, buildKeymap } from 'prosemirror-example-setup';
import { arrows } from '../common/plugins/arrows.js';
import { markdownStyle } from '../common/plugins/markdownStyle.js';
import { menuBar } from '../common/plugins/menuBar.js';
import { placeholder } from '../common/plugins/placeholder.js';
import { placeholderEmpty } from '../common/plugins/placeholderEmpty.js';
import { ButtonsDefault, buildMenuItems } from '../common/menuItems.js';
import { CodeBlockView } from '../common/nodeViews/codeBlock.js';
import { schemaCustom } from '../common/schema/schemaCustom.js';
import { markdownParserCustom } from '../common/schema/markdownParserCustom.js';
import { markdownSerializerCustom } from '../common/schema/markdownSerializerCustom.js';

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
    host: {
      type: Object,
    },
    placeholder: {
      type: String,
    },
  },
  data() {
    return {
      lastValue: this.value,
      menuItems: null,
    };
  },
  computed: {
    buttonsWant() {
      return this.buttons || ButtonsDefault;
    },
    placeholderText() {
      return this.placeholder || this.$text('TextEditorPlaceHolder');
    },
  },
  watch: {
    value(newValue) {
      if (newValue === this.lastValue) return;
      this.lastValue = newValue;
      const state = this._createState(this.lastValue);
      this.view.updateState(state);
    },
  },
  created() {
    this._buildMenuItems();
  },
  mounted() {
    this.init();
  },
  beforeDestroy() {
    this.view = null;
    this.menuItems = null;
  },
  methods: {
    async init() {
      // markdown style
      await this.$meta.module.use(this.$meta.config.markdown.style.module);
      // state
      const state = this._createState(this.lastValue);
      // view
      this.view = this._createView(state);
    },
    _buildMenuItems() {
      this.menuItems = buildMenuItems(this, schemaCustom, this.buttonsWant);
    },
    _createState(value) {
      const state = EditorState.create({
        schema: schemaCustom,
        doc: markdownParserCustom.parse(value || ''),
        // plugins: exampleSetup({ schema }),
        plugins: [
          buildInputRules(schemaCustom), //
          keymap(buildKeymap(schemaCustom)),
          // keymap({ 'Mod-z': undo, 'Mod-y': redo }),
          keymap(baseKeymap),
          dropCursor(),
          gapCursor(),
          menuBar({ ctx: this, menuItems: this.menuItems }),
          history(),
          arrows(),
          markdownStyle(),
          placeholder(),
          placeholderEmpty({ ctx: this, placeholderText: this.placeholderText }),
        ],
      });
      return state;
    },
    _createView(state) {
      const view = new EditorView(this.$refs.textEditorContent, {
        state,
        nodeViews: {
          code_block: (node, view, getPos) => {
            return new CodeBlockView(node, view, getPos, { ctx: this });
          },
        },
        dispatchTransaction: transaction => {
          return this._viewDispatchTransaction(view, transaction);
        },
      });
      return view;
    },
    _viewDispatchTransaction(view, transaction) {
      const newState = view.state.apply(transaction);
      view.updateState(newState);
      const mdValue = markdownSerializerCustom.serialize(newState.doc);
      if (this.lastValue !== mdValue) {
        this.lastValue = mdValue;
        this.$emit('input', this.lastValue);
      }
    },
    onButtonClick(event, menuItem) {
      event.preventDefault();
      if (!menuItem.enabled) return;
      menuItem.spec.run(this.view.state, this.view.dispatch, this.view, event);
    },
    _renderButton(menuItem) {
      // spec
      const spec = menuItem.spec;
      // classes
      const classes = {
        'text-editor-button': true,
        [`text-editor-button-${spec.key}`]: true,
        active: menuItem.active,
        disabled: !menuItem.enabled,
      };
      // icon
      let domIcon;
      if (spec.icon && spec.icon.material) {
        domIcon = <i class="material-icons">{spec.icon.material}</i>;
      } else if (spec.icon && spec.icon.text) {
        domIcon = <i class="icon">{spec.icon.text}</i>;
      }
      // button
      return (
        <button key={spec.key} title={spec.title} type="button" class={classes} onMousedown={event => this.onButtonClick(event, menuItem)}>
          {domIcon}
        </button>
      );
    },
    _renderButtons(domButtons, menuItems) {
      for (let index = 0; index < menuItems.length; index++) {
        const items = menuItems[index];
        let something = false;
        for (const item of items) {
          if (item.selected) {
            domButtons.push(this._renderButton(item));
            something = true;
          }
        }
        if (something && index < menuItems.length - 1) {
          const domButtonDivider = <div key={`button-divider-${index}`} class="text-editor-button-divider"></div>;
          domButtons.push(domButtonDivider);
        }
      }
      return null;
    },
    _renderToolbar() {
      if (this.mode !== 'toolbar') return null;
      const domButtons = [];
      this._renderButtons(domButtons, this.menuItems);
      return <div class="text-editor-toolbar">{domButtons}</div>;
    },
  },
  render() {
    const domToolbar = this._renderToolbar();
    return (
      <div class="text-editor text-editor-markdown">
        {domToolbar}
        <div ref="textEditorContent" class="text-editor-content no-active-state"></div>
      </div>
    );
  },
};
