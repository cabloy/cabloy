<template>
  <eb-link :class="buttonClass" :onPerform="onPerformClick">
    <div class="item" v-if="loggedIn">
      <img class="avatar" :src="userAvatar">
    </div>
    <div class="item name" v-if="loggedIn">{{userName}}</div>
    <div class="item status" v-if="!loggedIn">{{$text('Not LoggedIn')}}</div>
    <div :class="statsUserRedClass"><eb-stats :stats_params="{module:'a-user', name:'userRed'}" stats_color="red" @change="onChangeStatsUserRed"></eb-stats></div>
    <div :class="statsUserOrangeClass" class="item"><eb-stats :stats_params="{module:'a-user', name:'userOrange'}" stats_color="orange" @change="onChangeStatsUserOrange"></eb-stats></div>
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
      return {
        statsUserRed: null,
        statsUserOrange: null,
      };
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
      statsUserRedClass() {
        return {
          item: true,
          'display-none': !this.statsUserRed,
        };
      },
      statsUserOrangeClass() {
        return {
          item: true,
          'display-none': this.statsUserRed || !this.statsUserOrange,
        };
      },
    },
    methods: {
      onChangeStatsUserRed(value) {
        this.statsUserRed = value;
      },
      onChangeStatsUserOrange(value) {
        this.statsUserOrange = value;
      },
    },
  };
}

</script>
