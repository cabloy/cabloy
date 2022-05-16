<template>
  <eb-link :class="buttonClass" :onPerform="onPerform">
    <div class="item" v-if="loggedIn">
      <img class="avatar" :src="userAvatar" />
    </div>
    <div class="item name" v-if="loggedIn">{{ userName }}</div>
    <div class="item status" v-if="!loggedIn">{{ $text('Not LoggedIn') }}</div>
    <div class="item"><eb-stats-color :stats_params="{ module: 'a-user', name: 'user' }"></eb-stats-color></div>
  </eb-link>
</template>
<script>
// export
export default {
  installFactory,
};

// installFactory
function installFactory(_Vue) {
  const Vue = _Vue;
  const ebLayoutButtonBase = Vue.prototype.$meta.module.get('a-layoutpc').options.mixins.ebLayoutButtonBase;
  return {
    mixins: [ebLayoutButtonBase],
    data() {
      return {};
    },
    computed: {
      loggedIn() {
        return this.$store.state.auth.loggedIn;
      },
      user() {
        return this.$store.state.auth.user;
      },
      userName() {
        let userName = this.user.op.userName;
        if (this.user.op.id !== this.user.agent.id) {
          userName = `${userName}(${this.$text('Agent')})`;
        }
        return userName;
      },
      userAvatar() {
        let avatar = this.user.op.avatar;
        if (!avatar) {
          const configBase = this.$meta.config.modules['a-base'];
          avatar = configBase.user.avatar.default;
        }
        return this.$meta.util.combineImageUrl(avatar, 48);
      },
      buttonClass() {
        return {
          mine: true,
          'button-separator': this.buttonConfig.showSeparator,
        };
      },
    },
    mounted() {
      this._checkSpecialPath();
    },
    methods: {
      onPerform() {
        this.$meta.vueLayout.openMine();
      },
      onMineOpen() {
        this.onPerformClick();
      },
      _checkSpecialPath() {
        const query = this.$utils.parseUrlQuery();
        const path = query && query.__to;
        if (!path) return false;
        if (path === 'mine') {
          this.onPerform();
        }
      },
    },
  };
}
</script>
