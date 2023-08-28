export default {
  data() {
    return {};
  },
  methods: {
    info_getItemMetaMedia(avatar) {
      return this.$meta.util.combineAvatarUrl(avatar, 16);
    },
  },
};
