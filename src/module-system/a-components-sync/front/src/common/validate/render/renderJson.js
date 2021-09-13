export default {
  methods: {
    renderJson(c, context) {
      const { key, property } = context;
      const title = this.getTitle(context);
      return c(
        'eb-list-item',
        {
          key,
          staticClass: property.ebReadOnly ? 'text-color-gray' : '',
          props: {
            link: '#',
            onPerform: () => {
              // target
              let target = this.$meta.util.getProperty(property, 'ebParams.target');
              if (target === undefined) target = '_self';
              // actionSave
              const actionSave = this.$meta.util.getProperty(property, 'ebParams.actionSave') === true;
              // actionDone
              const actionDone = this.$meta.util.getProperty(property, 'ebParams.actionDone') !== false;
              // actions
              const actions = this.$meta.util.getProperty(property, 'ebParams.actions');
              // navigate
              this.$view.navigate(`/a/jsoneditor/json/editor?t=${Date.now()}`, {
                target,
                context: {
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
                    if (code === 200) {
                      context.setValue(value);
                      // submit
                      if (actionSave && property.ebAutoSubmit !== false) {
                        this.validate.onSubmit();
                      }
                    }
                  },
                },
              });
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
  },
};
