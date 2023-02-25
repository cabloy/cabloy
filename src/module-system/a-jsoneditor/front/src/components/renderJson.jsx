export default {
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
  created() {},
  beforeDestroy() {
    this.pageContext = null;
  },
  methods: {
    _onPerform() {
      const context = this.context;
      const { property } = context;
      // target
      let target = this.$meta.util.getProperty(property, 'ebParams.target');
      if (target === undefined) target = '_self';
      // navigate
      this.$view.navigate(`/a/jsoneditor/json/editor?t=${Date.now()}`, {
        target,
        context: this._onPerform_pageContext(context),
      });
    },
    _onPerform_pageContext(context) {
      const { property, validate } = context;
      const title = context.getTitle();
      // actionSave
      const actionSave = this.$meta.util.getProperty(property, 'ebParams.actionSave') === true;
      // actionDone
      const actionDone = this.$meta.util.getProperty(property, 'ebParams.actionDone') !== false;
      // actions
      const actions = this.$meta.util.getProperty(property, 'ebParams.actions');
      const pageContext = {
        params: {
          value: context.getValue(),
          valueType: property.type,
          title,
          readOnly: validate.readOnly || property.ebReadOnly,
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
    _renderJson() {
      const context = this.context;
      const { key, property, dataPath } = context;
      // render
      return (
        <eb-list-item
          key={key}
          class={property.ebReadOnly ? 'text-color-gray' : ''}
          link="#"
          dataPath={dataPath}
          propsOnPerform={this._onPerform}
        >
          {context.renderTitle({ slot: 'title' })}
        </eb-list-item>
      );
    },
  },
  render() {
    return this._renderJson();
  },
};
