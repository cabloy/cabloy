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
    immediate() {
      return this.contextParams.immediate;
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
      return this.content ? JSON.stringify(window.JSON5.parse(this.content)) : null;
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
      if (!this.actions) return;
      const children = [];
      for (const action of this.actions) {
        children.push(
          <eb-link iconMaterial={action.icon && action.icon.material} propsOnPerform={event => this.onPerformAction(event, action)}></eb-link>
        );
      }
      return children;
    },
  },
  render() {
    let domDone;
    if (!this.readOnly) {
      if (this.immediate) {
        domDone = (
          <eb-link iconMaterial="save" propsOnPerform={this.onPerformSave}></eb-link>
        );
      } else {
        domDone = (
          <eb-link iconMaterial="done" propsOnPerform={this.onPerformDone}></eb-link>
        );
      }
    }
    return (
      <eb-page>
        <eb-navbar title={this.pageTitle} eb-back-link="Back">
          <f7-nav-right>
            {domDone}
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
