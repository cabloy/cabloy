<template>
  <eb-page>
    <eb-navbar :title="$text('Agent')" eb-back-link="Back">
    </eb-navbar>
    <f7-list>
      <eb-list-item :title="$text('Agent')" group-title></eb-list-item>
      <eb-list-item v-if="!agentsBy || agentsBy.length===0" :title="$text('No agents')"></eb-list-item>
      <template v-if="agentsBy && agentsBy.length>0">
        <eb-list-item v-for="item of agentsBy" :key="item.id" radio disabled :checked="user.op.id===item.id" :title="item.userName">
          <div slot="after">
            <eb-button v-if="user.op.id===item.id" :context="item" :onPerform="onPerformSwitchOff">{{$text('Switch off')}}</eb-button>
            <eb-button v-else :context="item" :onPerform="onPerformSwitch">{{$text('Switch')}}</eb-button>
          </div>
        </eb-list-item>
      </template>
      <eb-list-item :title="$text('Agent by')" group-title></eb-list-item>
      <eb-list-item v-if="agent" :title="agent.userName">
        <div slot="after">
          <eb-button :onPerform="onPerformRemoveAgent">{{$text('Remove')}}</eb-button>
        </div>
      </eb-list-item>
      <f7-list-item v-if="!agent" :title="$text('Specify agent')" link="#" @click="onSelectUser"></f7-list-item>
    </f7-list>
  </eb-page>
</template>
<script>
import Vue from 'vue';
export default {
  components: {},
  data() {
    return {
      user: this.$store.state.auth.user,
      agent: null,
      agentsBy: null,
    };
  },
  created() {
    this.$api.post('user/agent').then(user => {
      this.agent = user;
    });
    this.$api.post('user/agentsBy').then(users => {
      this.agentsBy = users;
    });
  },
  methods: {
    onSelectUser() {
      this.$view.dialog.prompt(this.$text('Please specify the mobile')).then(mobile => {
        if (!mobile) return;
        this.$api.post('user/userByMobile', { mobile: 1 }).then(userAgent => {
          if (!userAgent) {
            this.$view.dialog.alert(this.$text('Not found'));
          } else {
            this.$view.dialog.confirm(`${mobile}<br>${userAgent.userName}`).then(() => {
              this.$api.post('user/addAgent', { userIdAgent: userAgent.id }).then(() => {
                this.agent = userAgent;
              });
            });
          }
        });
      });
    },
    onPerformRemoveAgent(event) {
      return this.$view.dialog.confirm(this.$text('Are you sure to perform this operation?')).then(() => {
        return this.$api.post('user/removeAgent', { userIdAgent: this.agent.id }).then(() => {
          this.agent = null;
        });
      });
    },
    onPerformSwitch(event, item) {
      return this.$view.dialog.confirm(this.$text('Are you sure to perform this operation?')).then(() => {
        return this.$api.post('user/switchAgent', { userIdAgent: item.id }).then(() => {
          this.$meta.vueApp.reload({ echo: true });
        });
      });
    },
    onPerformSwitchOff(event, item) {
      return this.$view.dialog.confirm(this.$text('Are you sure to perform this operation?')).then(() => {
        return this.$api.post('user/switchOffAgent').then(() => {
          this.$meta.vueApp.reload({ echo: true });
        });
      });
    },
  },
};

</script>
<style lang="less" scoped>


</style>
