export default {
  data() {
    return {};
  },
  methods: {
    bulk_renderActionsNormal() {
      if (!this.base_ready) return null;
      if (this.base_user.anonymous) return null;
      const children = [];
      // Todos
      children.push(
        <eb-link-color
          key="userAlert"
          iconF7="::alert"
          tooltip={this.$text('Todos')}
          eb-href="/a/message/group"
          eb-target="_self"
          stats_params={{ module: 'a-user', name: 'userAlert' }}
        ></eb-link-color>
      );
      // message
      children.push(
        <eb-link-color
          key="messages"
          iconF7="::message"
          tooltip={this.$text('Messages')}
          eb-href="/a/message/group"
          eb-target="_self"
          stats_params={{ module: 'a-message', name: 'message' }}
        ></eb-link-color>
      );
      // settings
      if (!this.base_inAgent) {
        children.push(
          <eb-link
            key="settings"
            iconF7="::settings"
            tooltip={this.$text('Settings')}
            eb-href="user/mineAgent"
            eb-target="_self"
          ></eb-link>
        );
      }
      //
      return children;
    },
  },
};
