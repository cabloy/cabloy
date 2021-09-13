import Vue from 'vue';
const ebPageContext = Vue.prototype.$meta.module.get('a-components').options.mixins.ebPageContext;
const ebPageDirty = Vue.prototype.$meta.module.get('a-components').options.mixins.ebPageDirty;
export default {
  meta: {
    size: 'medium',
  },
  mixins: [ebPageContext, ebPageDirty],
  data() {
    return {
      content: this.value,
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
    page_title() {
      return this.page_getDirtyTitle(this.title);
    },
  },
  created() {},
  methods: {
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
        targetEl: event.target,
      };
      await this.$meta.util.performAction({ ctx: this, action, item: this.context });
    },
    renderActions() {
      const children = [];
      // save/done
      if (!this.readOnly) {
        if (this.actionSave) {
          children.push(<eb-link key="actionSave" ref="actionSave" iconMaterial="save" propsOnPerform={this.onPerformSave}></eb-link>);
        }
        if (this.actionDone) {
          children.push(<eb-link key="actionDone" ref="actionDone" iconMaterial="done" propsOnPerform={this.onPerformDone}></eb-link>);
        }
      }
      // actions
      if (!this.actions) return children;
      for (const action of this.actions) {
        if (action.readOnly === undefined || action.readOnly === this.readOnly) {
          const icon = action.icon && action.icon.material;
          const title = action.title ? this.$text(action.title) : null;
          children.push(<eb-link key={action.name} iconMaterial={icon} text={title} propsOnPerform={event => this.onPerformAction(event, action)}></eb-link>);
        }
      }
      // ok
      return children;
    },
  },
  render() {
    return (
      <eb-page>
        <eb-navbar title={this.page_title} eb-back-link="Back">
          <f7-nav-right>{this.renderActions()}</f7-nav-right>
        </eb-navbar>
        <eb-json-editor ref="jsonEditor" readOnly={this.readOnly} valueType={this.valueType} value={this.content} onInput={this.onInput} onSave={this.onSaveEditor}></eb-json-editor>
      </eb-page>
    );
  },
};
