export default {
  methods: {
    async _onActionLoginLog() {
      const { ctx, item } = this.$props;
      const params = {
        filter: {
          formAtomClass: {
            userId: item.userId,
            _userIdName: item.userName,
            _userIdAvatar: item.avatar,
          },
        },
      };
      const options = {};
      const queries = {
        module: 'a-useronline',
        atomClassName: 'userOnlineHistory',
        options: JSON.stringify(options),
        params: JSON.stringify(params),
      };
      const actionPath = ctx.$meta.util.combineQueries('/a/basefront/atom/list', queries);
      ctx.$view.navigate(actionPath);
    },
  },
};
