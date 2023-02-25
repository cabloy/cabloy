export default {
  methods: {
    renderTitle(context, { slot, notHint }) {
      return (
        <div slot="label">
          <span>aa</span>
          <span> *</span>
        </div>
      );
    },
    __getTitle(context, notHint) {
      const { property } = context;
      // result
      const result = {
        title: null,
        must: null,
        Optional: null,
      };
      // not use 'key' as default title
      const _title = property.ebTitle || '';
      if (_title) {
        result.title = this.$text(_title);
      }
      // ignore panel/group/toggle
      const ebType = property.ebType;
      if (ebType === 'panel' || ebType === 'group' || ebType === 'group-flatten' || ebType === 'toggle') {
        return result;
      }
      // only edit
      if (this.validate.readOnly || property.ebReadOnly) return result;
      // hint
      if (!notHint) {
        // config
        let hint = this.validate.host && this.validate.host.hint;
        if (!hint && hint !== false) {
          hint = this.$config.validate.hint;
        }
        if (hint === false) {
          return result;
        }
        const hintOptional = hint.optional;
        const hintMust = hint.must;
        // check optional
        if (hintOptional && !property.notEmpty) {
          result.optional = this.$text(hintOptional);
          return result;
        }
        // check must
        if (hintMust && property.notEmpty) {
          result.must = this.$text(hintMust);
          return result;
        }
      }
      // default
      return result;
    },
    getTitle(context, notHint) {
      const result = this.__getTitle(context, notHint);
      if (result.optional) {
        return `${result.title}${result.optional}`;
      }
      if (result.must) {
        return `${result.title}${result.must}`;
      }
      // default
      return result.title;
    },
    getPlaceholder(context) {
      const { property } = context;
      if (this.validate.readOnly || property.ebReadOnly) return undefined;
      return property.ebDescription ? this.$text(property.ebDescription) : this.getTitle(context, true);
    },
  },
};
