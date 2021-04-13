import Vue from 'vue';
const ebPageContext = Vue.prototype.$meta.module.get('a-components').options.mixins.ebPageContext;
export default {
  meta: {
    size: 'medium',
  },
  mixins: [ ebPageContext ],
  data() {
    return {
      content: null,
    };
  },
  computed: {
    value() {
      return this.contextParams.value;
    },
    pageTitle() {
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
      return this.context.property.type || 'string';
    },
  },
  created() {
    if (!this.value) {
      this.content = '{}';
    } else {
      if (typeof this.value === 'string') {
        this.content = window.JSON5.stringify(window.JSON5.parse(this.value), null, 2);
      } else {
        this.content = window.JSON5.stringify(this.value, null, 2);
      }
    }
  },
  methods: {
    onSize(size) {
      this.$$(this.$refs.textarea).css({
        height: `${size.height - 20}px`,
        width: `${size.width - 20}px`,
      });
    },
    onInput(event) {
      this.content = event.target.value;
    },
    getValue() {
      // string
      if (this.valueType === 'string') {
        return this.content ? JSON.stringify(window.JSON5.parse(this.content)) : null;
      }
      // object
      return this.content ? window.JSON5.parse(this.content) : null;
    },
    onPerformDone() {
      const value = this.getValue();
      this.contextCallback(200, value);
      this.$f7router.back();
    },
    onPerformSave() {
      const value = this.getValue();
      return this.onSave(value).then(() => {
        return this.$text('Saved');
      });
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
          children.push(
            <eb-link key="actionSave" iconMaterial="save" propsOnPerform={this.onPerformSave}></eb-link>
          );
        }
        if (this.actionDone) {
          children.push(
            <eb-link key="actionDone" iconMaterial="done" propsOnPerform={this.onPerformDone}></eb-link>
          );
        }
      }
      // actions
      if (!this.actions) return children;
      for (const action of this.actions) {
        if (action.readOnly === undefined || action.readOnly === this.readOnly) {
          const icon = action.icon && action.icon.material;
          const title = action.title ? this.$text(action.title) : null;
          children.push(
            <eb-link key={action.name} iconMaterial={icon} text={title} propsOnPerform={event => this.onPerformAction(event, action)}></eb-link>
          );
        }
      }
      // ok
      return children;
    },
  },
  render() {
    return (
      <eb-page>
        <eb-navbar title={this.pageTitle} eb-back-link="Back">
          <f7-nav-right>
            {this.renderActions()}
          </f7-nav-right>
        </eb-navbar>
        <eb-box onSize={this.onSize}>
          <textarea ref="textarea" readonly={this.readOnly ? 'readonly' : false} type="textarea" value={this.content} onInput={this.onInput} class="json-textarea json-textarea-margin"></textarea>
        </eb-box>
      </eb-page>
    );
  },
};
