export default {
  methods: {
    item_getAtomName(item, fieldName) {
      // 1. force the fieldName
      if (fieldName) {
        return item[fieldName];
      }
      // 2. _meta.atomName
      const atomName = item._meta?.atomName;
      if (atomName) {
        return atomName;
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
    item_getAtomNameForEdit(item, fieldName) {
      // 1. force the fieldName
      if (fieldName) {
        return item[fieldName];
      }
      // 2. fields.mappings.atomName
      const atomClassBase = this.base.atomClassBase;
      const atomNameFieldName = atomClassBase?.fields?.mappings?.atomName;
      if (atomNameFieldName) {
        return item[atomNameFieldName];
      }
      // 3. atomName
      return item.atomName;
    },
    item_getMetaMedia(item, fieldName) {
      const media = this.item_getMetaMedia_inner(item, fieldName);
      return this.$meta.util.combineAvatarUrl(media, 24);
    },
    item_getMetaMedia_inner(item, fieldName) {
      // 1. force the fieldName
      if (fieldName) {
        return item[fieldName];
      }
      // 2. _meta.media
      const media = item._meta?.media;
      if (media) {
        return media;
      }
      // 3. fields.mappings.atomMedia
      const atomClassBase = this.base.atomClassBase;
      const atomMediaFieldName = atomClassBase?.fields?.mappings?.atomMedia;
      if (atomMediaFieldName) {
        return item[atomMediaFieldName];
      }
      // 4. avatar
      return item.avatar;
    },
    item_getMetaMediaLabel(item, fieldName) {
      // 1. force the fieldName
      if (fieldName) {
        return item[fieldName];
      }
      // 2. _meta.mediaLabel
      const mediaLabel = item._meta?.mediaLabel;
      if (mediaLabel) {
        return mediaLabel;
      }
      // 3. fields.mappings.atomMedia
      const atomClassBase = this.base.atomClassBase;
      const atomMediaLabelFieldName = atomClassBase?.fields?.mappings?.atomMediaLabel;
      if (atomMediaLabelFieldName) {
        return item[atomMediaLabelFieldName];
      }
      // 4. userName
      return item.userName;
    },
  },
};
