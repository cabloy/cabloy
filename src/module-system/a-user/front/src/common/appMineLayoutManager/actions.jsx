export default {
  data() {
    return {
      actions: {
        list: null,
      },
    };
  },
  methods: {
    actions_render() {
      if (!this.base_ready) return null;
      if (this.base_user.anonymous) return null;
      const children = [];
      // message
      children.push(
        <eb-link-color
          key="messages"
          iconF7="::message"
          eb-href="/a/message/group"
          eb-target="_self"
          stats_params={{ module: 'a-message', name: 'message' }}
        ></eb-link-color>
      );
      // settings
      if (!this.base_inAgent) {
        children.push(
          <eb-link key="settings" iconF7="::settings" eb-href="user/mineAgent" eb-target="_self"></eb-link>
        );
      }
      //
      return children;
    },
  },
};
