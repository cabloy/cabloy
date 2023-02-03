export default {
  methods: {
    item_renderMetaFlags(item) {
      const domMetaFlags = [];
      // flow
      if (item._atomStateTitleLocale) {
        domMetaFlags.push(
          <f7-badge key="_atomStateTitleLocale" color="orange">
            {item._atomStateTitleLocale}
          </f7-badge>
        );
      }
      // flags
      const itemFlags = this.item_getMetaFlags(item);
      for (const flag of itemFlags) {
        domMetaFlags.push(<f7-badge key={flag}>{flag}</f7-badge>);
      }
      return domMetaFlags;
    },
    item_getMetaFlags(item) {
      let flags = (item._meta && item._meta.flags) || [];
      if (!Array.isArray(flags)) flags = flags.split(',');
      return flags;
    },
  },
};
