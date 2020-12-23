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
  },
  created() {
    if (!this.value) {
      this.content = '{}';
    } else {
      this.content = window.JSON5.stringify(window.JSON5.parse(this.value), null, 2);
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
          </f7-nav-right>
        </eb-navbar>
        <eb-box onSize={this.onSize}>
          <textarea ref="textarea" readonly={this.readOnly ? 'readonly' : false} type="textarea" value={this.content} onInput={this.onInput} class="json-textarea json-textarea-margin"></textarea>
        </eb-box>
      </eb-page>
    );
  },
};
