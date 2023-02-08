export default {
  methods: {
    item_getAtomStateColor(item) {
      return item.atomClosed === 0 ? 'orange' : 'gray';
    },
    item_renderMetaFlags(item) {
      const domMetaFlags = [];
      // flow
      if (item._atomStateTitleLocale) {
        domMetaFlags.push(
          <f7-badge key="_atomStateTitleLocale" color={this.item_getAtomStateColor(item)}>
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
