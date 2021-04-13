export default {
  methods: {
    renderJson(c, context) {
      const { parcel, key, property /* dataPath, meta*/ } = context;
      const title = this.getTitle(context);
      return c('eb-list-item', {
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
            this.$view.navigate(`/a/basefront/json/editor?t=${Date.now()}`, {
              target,
              context: {
                params: {
                  value: this.getValue(parcel, key),
                  title,
                  readOnly: this.validate.readOnly || property.ebReadOnly,
                  actionSave,
                  actionDone,
                  onSave: value => {
                    this.setValue(parcel, key, value);
                    return this.validate.perform(null);
                  },
                  actions,
                  context,
                },
                callback: (code, value) => {
                  if (code === 200) {
                    this.setValue(parcel, key, value);
                    // submit
                    if (property.ebAutoSubmit !== false) {
                      this.validate.onSubmit();
                    }
                  }
                },
              },
            });
          },
        },
      }, [
        c('div', {
          slot: 'title',
          staticClass: property.ebReadOnly ? 'text-color-gray' : '',
          domProps: { innerText: title },
        }),
      ]);
    },
  },
};
