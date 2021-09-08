// import { schema } from 'prosemirror-schema-basic';
import { EditorState } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { history } from 'prosemirror-history';
import { keymap } from 'prosemirror-keymap';
import { baseKeymap } from 'prosemirror-commands';
import { dropCursor } from 'prosemirror-dropcursor';
import { gapCursor } from 'prosemirror-gapcursor';
import { buildKeymap } from 'prosemirror-example-setup';
import { arrows } from '../common/plugins/arrows.js';
import { markdownStyle } from '../common/plugins/markdownStyle.js';
import { menuBar } from '../common/plugins/menuBar.js';
import { placeholder } from '../common/plugins/placeholder.js';
import { placeholderEmpty } from '../common/plugins/placeholderEmpty.js';
import { ButtonsDefault, buildMenuItems } from '../common/menuItems.js';
import { CabloyBlockView } from '../common/nodeViews/cabloyBlock.js';
import { CodeBlockView } from '../common/nodeViews/codeBlock.js';
import { HtmlInlineView } from '../common/nodeViews/html_inline.js';
import { schemaCustom } from '../common/schema/schemaCustom.js';
import { markdownParserCustom } from '../common/schema/markdownParserCustom.js';
import { markdownSerializerCustom } from '../common/schema/markdownSerializerCustom.js';
import { buildInputRules } from '../common/inputrules/base.js';
import { buildInputRulesLinks } from '../common/inputrules/links.js';
import { buildInputRulesTextFormatting } from '../common/inputrules/text-formatting.js';
import { buildKeymapCustom } from '../common/keymaps/custom.js';
import { tableEditing, fixTables } from 'prosemirror-tables';

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
    toolbar: {
      type: Boolean,
      default: true,
    },
    host: {
      type: Object,
    },
    placeholder: {
      type: String,
    },
    viewMode: {
      type: String,
      default: 'editor', // editor/source
    },
  },
  data() {
    return {
      toolbarInner: this.toolbar,
      lastValue: this.value,
      menuItems: null,
      viewModeInner: this.viewMode,
    };
  },
  computed: {
    buttonsWant() {
      return this.buttons || ButtonsDefault;
    },
    placeholderText() {
      return this.placeholder || this.$text('TextEditorPlaceHolder');
    },
    host2() {
      return Object.assign({}, this.host, {
        mode: 'edit',
      });
    },
  },
  watch: {
    value(newValue) {
      if (newValue === this.lastValue) return;
      this.lastValue = newValue;
      if (this.viewWrapper) {
        this.viewWrapper.update();
      }
    },
    toolbar(newValue) {
      if (newValue === this.toolbarInner) return;
      this._setToolbar(newValue, false);
    },
    viewMode(newValue) {
      if (newValue === this.viewModeInner) return;
      this.$nextTick(() => {
        this._setViewMode(newValue, false);
      });
    },
  },
  created() {
    this._buildMenuItems();
  },
  mounted() {
    this.init();
  },
  beforeDestroy() {
    if (this.viewWrapper) {
      this.viewWrapper.destroy();
      this.viewWrapper = null;
    }
    this.menuItems = null;
  },
  methods: {
    async init() {
      // markdown style
      await this.$meta.module.use(this.$meta.config.markdown.style.module);
      // codemirror
      await this.$meta.module.use('a-codemirror');
      // view
      this._setViewMode(this.viewModeInner, false);
    },
    _buildMenuItems() {
      this.menuItems = buildMenuItems(this, schemaCustom, this.buttonsWant);
    },
    _setToolbar(toolbar, fireEvent) {
      if (toolbar === this.toolbarInner) return;
      this.toolbarInner = toolbar;
      if (fireEvent) {
        this.$emit('toolbar', toolbar);
      }
    },
    _setViewMode(viewMode, fireEvent) {
      if (this.viewWrapper && this.viewWrapper.viewMode === viewMode) return;
      if (this.viewWrapper) {
        this.viewWrapper.destroy();
      }
      if (viewMode === 'editor') {
        this.viewWrapper = this._createViewProsemirror();
      } else {
        this.viewWrapper = this._createViewSource();
      }
      this.viewWrapper.focus();
      this.viewWrapper.viewMode = viewMode;
      this.viewModeInner = viewMode;
      if (fireEvent) {
        this.$emit('viewMode', viewMode);
      }
    },
    _createState(value) {
      let state = EditorState.create({
        schema: schemaCustom,
        doc: markdownParserCustom.parse(value || ''),
        // plugins: exampleSetup({ schema }),
        plugins: [
          buildInputRules(schemaCustom), //
          buildInputRulesLinks(schemaCustom),
          buildInputRulesTextFormatting(schemaCustom),
          keymap(buildKeymap(schemaCustom)),
          keymap(buildKeymapCustom(schemaCustom, this)),
          keymap(baseKeymap),
          dropCursor(),
          gapCursor(),
          menuBar({ ctx: this, menuItems: this.menuItems }),
          history(),
          arrows(),
          markdownStyle(),
          placeholder(),
          placeholderEmpty({ ctx: this, placeholderText: this.placeholderText }),
          tableEditing(),
        ],
      });
      const fix = fixTables(state);
      if (fix) {
        state = state.apply(fix.setMeta('addToHistory', false));
      }
      return state;
    },
    _createViewSource() {
      const self = this;
      const view = this.$refs.textEditorContent.appendChild(document.createElement('textarea'));
      view.className = 'markdown-source';
      view.value = this.lastValue;
      function onInput() {
        self._emitEventInput(view.value);
      }
      view.addEventListener('input', onInput);
      return {
        view,
        focus() {
          view.focus();
        },
        destroy() {
          view.removeEventListener('input', onInput);
          view.remove();
        },
        update() {
          view.value = self.lastValue;
        },
      };
    },
    _createViewProsemirror() {
      const self = this;
      // state
      const state = this._createState(this.lastValue);
      // view
      const view = new EditorView(this.$refs.textEditorContent, {
        state,
        nodeViews: {
          cabloy_block: (node, view, getPos) => {
            return new CabloyBlockView(node, view, getPos, this);
          },
          code_block: (node, view, getPos) => {
            return new CodeBlockView(node, view, getPos);
          },
          html_inline: (node, view, getPos) => {
            return new HtmlInlineView(node, view, getPos);
          },
        },
        dispatchTransaction: transaction => {
          return this._viewDispatchTransaction(view, transaction);
        },
      });
      // view wrapper
      return {
        view,
        focus() {
          view.focus();
        },
        destroy() {
          view.destroy();
        },
        update() {
          const state = self._createState(self.lastValue);
          view.updateState(state);
        },
      };
    },
    _viewDispatchTransaction(view, transaction) {
      const newState = view.state.apply(transaction);
      view.updateState(newState);
      const mdValue = markdownSerializerCustom.serialize(newState.doc);
      this._emitEventInput(mdValue);
    },
    _emitEventInput(mdValue) {
      if (this.lastValue !== mdValue) {
        this.lastValue = mdValue;
        this.$emit('input', this.lastValue);
      }
    },
    onButtonClick(event, menuItem) {
      event.preventDefault();
      if (!menuItem.enabled) return;
      const view = this.viewWrapper.view;
      menuItem.spec.run(view.state, view.dispatch, view, event);
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
      if (!this.toolbarInner) return <div></div>;
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
