export default {
  data() {
    return {
      renderJson_pageContexts: {},
    };
  },
  beforeDestroy() {
    this.renderJson_pageContexts = {};
  },
  methods: {
    renderJson(c, context) {
      const { key, property, dataPath } = context;
      const title = this.getTitle(context);
      // pageContext
      const pageContext = this.renderJson_pageContexts[dataPath];
      if (pageContext) {
        pageContext.setPageContext(this.renderJson_onPerform_pageContext(context));
      }
      // render
      return c(
        'eb-list-item',
        {
          key,
          staticClass: property.ebReadOnly ? 'text-color-gray' : '',
          props: {
            link: '#',
            onPerform: () => {
              this.renderJson_onPerform(context);
            },
          },
        },
        [
          c('div', {
            slot: 'title',
            staticClass: property.ebReadOnly ? 'text-color-gray' : '',
            domProps: { innerText: title },
          }),
        ]
      );
    },
    renderJson_onPerform_pageContext(context) {
      const { property, dataPath } = context;
      const title = this.getTitle(context);
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
          readOnly: this.validate.readOnly || property.ebReadOnly,
          actionSave,
          actionDone,
          onSave: value => {
            context.setValue(value);
            return this.validate.perform(null, { action: 'save' });
          },
          actions,
          context,
        },
        callback: (code, value) => {
          if (code === 201) {
            this.renderJson_pageContexts[dataPath] = value;
          }
          if (code === null || code === false) {
            this.renderJson_pageContexts[dataPath] = null;
          }
          if (code === 200) {
            context.setValue(value);
            // submit
            if (actionSave && property.ebAutoSubmit !== false) {
              this.validate.onSubmit();
            }
          }
        },
      };
      return pageContext;
    },
    renderJson_onPerform(context) {
      const { property } = context;
      // target
      let target = this.$meta.util.getProperty(property, 'ebParams.target');
      if (target === undefined) target = '_self';
      // navigate
      this.$view.navigate(`/a/jsoneditor/json/editor?t=${Date.now()}`, {
        target,
        context: this.renderJson_onPerform_pageContext(context),
      });
    },
  },
};
