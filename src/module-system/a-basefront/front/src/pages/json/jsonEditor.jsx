import Vue from 'vue';
const ebPageContext = Vue.prototype.$meta.module.get('a-components').options.mixins.ebPageContext;
export default {
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
    onPerformDone() {
      const data = this.content ? JSON.stringify(window.JSON5.parse(this.content)) : null;
      this.contextCallback(200, data);
      this.$f7router.back();
    },
  },
  render() {
    let domDone;
    if (!this.readOnly) {
      domDone = (
        <eb-link iconMaterial="done" propsOnPerform={this.onPerformDone}></eb-link>
      );
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
