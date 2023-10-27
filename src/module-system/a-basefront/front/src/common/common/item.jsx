export default {
  methods: {
    item_getAtomName(item, fieldName) {
      // 1. force the fieldName
      if (fieldName) {
        return item[fieldName];
      }
      // 2. _meta.atomName
      if (item._meta?.atomName) {
        return item._meta?.atomName;
      }
      // 3. fields.mappings.atomName
      const atomClassBase = this.base.atomClassBase;
      const atomNameFieldName = atomClassBase?.fields?.mappings?.atomName;
      if (atomNameFieldName) {
        return item[atomNameFieldName];
      }
      // 4. atomNameLocale/atomName
      return item.atomNameLocale || item.atomName;
    },
  },
};
