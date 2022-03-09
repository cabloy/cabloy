import Vue from 'vue';
import utils from '../common/utils.js';
const ebPageContext = Vue.prototype.$meta.module.get('a-components').options.mixins.ebPageContext;
const ebPageDirty = Vue.prototype.$meta.module.get('a-components').options.mixins.ebPageDirty;
export default {
  meta: {
    size: 'medium',
  },
  mixins: [ebPageContext, ebPageDirty],
  data() {
    return {
      content: null,
    };
  },
  computed: {
    value() {
      return this.contextParams.value;
    },
    title() {
      return this.contextParams.title;
    },
    readOnly() {
      return this.contextParams.readOnly;
    },
    actionSave() {
      return this.contextParams.actionSave;
    },
    actionDone() {
      return this.contextParams.actionDone;
    },
    onSave() {
      return this.contextParams.onSave;
    },
    actions() {
      return this.contextParams.actions;
    },
    context() {
      return this.contextParams.context;
    },
    valueType() {
      return this.contextParams.valueType;
    },
    valueMode() {
      return this.contextParams.valueMode || 'json';
    },
    page_title() {
      return this.page_getDirtyTitle(this.title);
    },
  },
  watch: {
    value(newValue) {
      this._updateValue(newValue);
    },
  },
  created() {
    this.content = this.value;
  },
  methods: {
    onPageReinit() {
      const jsonEditor = this.$refs.jsonEditor;
      if (jsonEditor && jsonEditor.cmEditor) {
        jsonEditor.cmEditor.focus();
        jsonEditor.cmEditor.refresh();
      }
    },
    async _updateValue(newValue) {
      if (utils.parseValue(newValue, this.valueMode) === utils.parseValue(this.content, this.valueMode)) return;
      if (!this.page_getDirty()) {
        this.content = newValue;
        return;
      }
      // prompt
      try {
        await this.$view.dialog.confirm(this.$text('DataChangedReloadConfirm'), this.title);
        if (this.page_getDirty()) {
          // use the lastest one when more updates
          this.content = newValue;
          this.page_setDirty(false);
        }
      } catch (err) {
        // do nothing
      }
    },
    onInput(value) {
      this.content = value;
      this.page_setDirty(true);
    },
    onSaveEditor() {
      if (this.$refs.actionSave) {
        this.$refs.actionSave.onClick();
      }
    },
    async onPerformSave() {
      await this.onSave(this.content);
      this.page_setDirty(false);
      return this.$text('Saved');
    },
    onPerformDone() {
      this.contextCallback(200, this.content);
      this.page_setDirty(false);
      this.$f7router.back();
    },
    async onPerformAction(event, action) {
      action = {
        ...action,
        targetEl: event.currentTarget,
      };
      await this.$meta.util.performAction({ ctx: this, action, item: this.context });
    },
    renderActions() {
      const children = [];
      // save/done
      if (!this.readOnly) {
        if (this.actionSave) {
          children.push(
            <eb-link key="actionSave" ref="actionSave" iconF7="::save" propsOnPerform={this.onPerformSave}></eb-link>
          );
        }
        if (this.actionDone) {
          children.push(
            <eb-link key="actionDone" ref="actionDone" iconF7="::done" propsOnPerform={this.onPerformDone}></eb-link>
          );
        }
      }
      // actions
      if (!this.actions) return children;
      for (const action of this.actions) {
        if (action.readOnly === undefined || action.readOnly === this.readOnly) {
          const title = action.title ? this.$text(action.title) : null;
          children.push(
            <eb-link
              key={action.name}
              iconMaterial={action.icon && action.icon.material}
              iconF7={action.icon && action.icon.f7}
              text={title}
              propsOnPerform={event => this.onPerformAction(event, action)}
            ></eb-link>
          );
        }
      }
      // ok
      return children;
    },
  },
  render() {
    return (
      <eb-page onPageReinit={this.onPageReinit}>
        <eb-navbar title={this.page_title} eb-back-link="Back">
          <f7-nav-right>{this.renderActions()}</f7-nav-right>
        </eb-navbar>
        <eb-json-editor
          ref="jsonEditor"
          readOnly={this.readOnly}
          valueType={this.valueType}
          valueMode={this.valueMode}
          value={this.content}
          onInput={this.onInput}
          onSave={this.onSaveEditor}
        ></eb-json-editor>
      </eb-page>
    );
  },
};
