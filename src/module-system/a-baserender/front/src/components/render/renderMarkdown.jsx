export default {
  meta: {
    preloads: 'a-markdown,a-markdownstyle,a-codemirror',
  },
  props: {
    context: {
      type: Object,
    },
  },
  data() {
    return {
      pageContext: null,
    };
  },
  watch: {
    context(newValue) {
      if (this.pageContext) {
        this.pageContext.setPageContext(this._onPerform_pageContext(newValue));
      }
    },
  },
  created() {
    const { validate } = this.context;
    validate.registerCallbackPerformBefore(this._onValidatePerformBefore);
  },
  beforeDestroy() {
    const { validate } = this.context;
    validate.unRegisterCallbackPerformBefore(this._onValidatePerformBefore);
    this.pageContext = null;
  },
  methods: {
    async _onValidatePerformBefore() {
      const { validate } = this.context;
      if (validate.readOnly) return;
      const useStoreUtils = await this.$store.use('a/markdown/utils');
      await useStoreUtils.checkContent({ ctx: this, content: this.context.getValue() });
    },
    _onPerform() {
      const context = this.context;
      const { property } = context;
      // target
      let target = this.$meta.util.getProperty(property, 'ebParams.target');
      if (target === undefined) target = '_self';
      // navigate
      this.$view.navigate(`/a/markdown/markdown/editor?t=${Date.now()}`, {
        target,
        context: this._onPerform_pageContext(context),
      });
    },
    _onPerform_pageContext(context) {
      const { property, validate } = context;
      const title = context.getTitle(true);
      // host
      const host = this.$meta.util.getProperty(property, 'ebParams.host');
      // actionSave
      const actionSave = this.$meta.util.getProperty(property, 'ebParams.actionSave') === true;
      // actionDone
      const actionDone = this.$meta.util.getProperty(property, 'ebParams.actionDone') !== false;
      // actions
      const actions = this.$meta.util.getProperty(property, 'ebParams.actions');
      const pageContext = {
        params: {
          value: context.getValue(),
          title,
          readOnly: validate.readOnly || property.ebReadOnly,
          host,
          actionSave,
          actionDone,
          onSave: value => {
            context.setValue(value);
            return validate.perform(null, { action: 'save' });
          },
          actions,
          context,
        },
        callback: (code, value) => {
          if (code === 201) {
            this.pageContext = value;
          }
          if (code === null || code === false) {
            this.pageContext = null;
          }
          if (code === 200) {
            context.setValue(value);
            // submit
            if (actionSave && property.ebAutoSubmit !== false) {
              validate.onSubmit();
            }
          }
        },
      };
      return pageContext;
    },
    _renderMarkdown() {
      const context = this.context;
      const { key, property } = context;
      // render
      return (
        <eb-list-item
          key={key}
          class={property.ebReadOnly ? 'text-color-gray' : ''}
          link="#"
          propsOnPerform={this._onPerform}
        >
          {context.renderTitle({ slot: 'title' })}
        </eb-list-item>
      );
    },
  },
  render() {
    return this._renderMarkdown();
  },
};
