<template>
  <eb-link :class="buttonClass" :onPerform="onPerformClick">
    <div class="item" v-if="loggedIn">
      <img class="avatar avatar24" :src="userAvatar">
    </div>
    <div class="item name" v-if="loggedIn">{{userName}}</div>
    <div class="item status" v-if="!loggedIn">{{$text('Not LoggedIn')}}</div>
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
    mixins: [ ebLayoutButtonBase ],
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
      buttonConfig() {
        return this.button.options.resourceConfig;
      },
      buttonClass() {
        return {
          mine: true,
          'header-button-separator': this.buttonConfig.showSeparator,
        };
      },
    },
  };
}

</script>
