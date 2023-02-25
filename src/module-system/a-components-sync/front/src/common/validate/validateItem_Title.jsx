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
    getTitle(context, notHint) {
      const { property } = context;
      // not use 'key' as default title
      let title = property.ebTitle || '';
      if (title) {
        title = this.$text(title);
      }
      // ignore panel/group/toggle
      const ebType = property.ebType;
      if (ebType === 'panel' || ebType === 'group' || ebType === 'group-flatten' || ebType === 'toggle') return title;
      // only edit
      if (this.validate.readOnly || property.ebReadOnly) return title;
      // hint
      if (!notHint) {
        // config
        let hint = this.validate.host && this.validate.host.hint;
        if (!hint && hint !== false) {
          hint = this.$config.validate.hint;
        }
        if (hint === false) {
          return title;
        }
        const hintOptional = hint.optional;
        const hintMust = hint.must;
        // check optional
        if (hintOptional && !property.notEmpty) {
          return `${title}${this.$text(hintOptional)}`;
        }
        // check must
        if (hintMust && property.notEmpty) {
          return `${title}${this.$text(hintMust)}`;
        }
      }
      // default
      return title;
    },
    getPlaceholder(context) {
      const { property } = context;
      if (this.validate.readOnly || property.ebReadOnly) return undefined;
      return property.ebDescription ? this.$text(property.ebDescription) : this.getTitle(context, true);
    },
  },
};
