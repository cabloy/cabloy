export default {
  methods: {
    renderTitle(context, { slot, notHint }) {
      const { property } = context;
      // title
      const result = this.__getTitle(context, notHint);
      const options = {
        slot: 'label',
      };
      // slot
      if (slot) {
        options.slot = slot;
      }
      // class
      options.class =
        !this.validate.readOnly && property.ebReadOnly ? 'eb-form-item-title text-color-gray' : 'eb-form-item-title';
      // hint
      let domHint;
      if (result.optional) {
        domHint = <span class="eb-form-item-title-hint-optional">{result.optional}</span>;
      } else if (result.must) {
        domHint = <span class="eb-form-item-title-hint-must">{result.must}</span>;
      }
      // return
      return (
        <div {...options}>
          <span class="eb-form-item-title-inner">{result.title}</span>
          {domHint}
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
