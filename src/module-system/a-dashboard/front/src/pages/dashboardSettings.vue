<template>
  <eb-page>
    <eb-navbar :title="$text('Profile2')" eb-back-link="Back">
      <f7-nav-right>
        <eb-link v-if="user.op.anonymous!==1" iconMaterial="add" :onPerform="onPerformNewProfile"></eb-link>
      </f7-nav-right>
    </eb-navbar>
    <f7-list>
      <eb-list-item v-for="item of profiles" :key="item.id" :title="item.profileName" radio :checked="item.id===profileIdCurrent" :context="item" :onPerform="onPerformProfile" swipeout>
        <eb-context-menu>
          <div slot="right">
            <div v-if="user.op.anonymous!==1 && item.id===profileIdCurrent" color="orange" :context="item" :onPerform="onPerformClone">{{$text('Clone')}}</div>
            <div v-if="user.op.anonymous!==1 && item.id>0 && item.id!==profileIdCurrent" color="red" :context="item" :onPerform="onPerformDelete">{{$text('Delete')}}</div>
          </div>
        </eb-context-menu>
      </eb-list-item>
    </f7-list>
    <f7-toolbar bottom-md>
      <eb-button :onPerform="onPerformAddGroup">{{$text('Add Group')}}</eb-button>
      <eb-button :onPerform="onPerformAddWidget">{{$text('Add Widget')}}</eb-button>
    </f7-toolbar>
  </eb-page>
</template>
<script>
import Vue from 'vue';
const ebPageContext = Vue.prototype.$meta.module.get('a-components').options.components.ebPageContext;
export default {
  mixins: [ebPageContext],
  data() {
    return {
      profileIdCurrent: parseInt(this.$f7route.query.profileId || 0),
      profiles: null,
    };
  },
  computed: {
    dashboard() {
      return this.contextParams.dashboard;
    },
    user() {
      return this.$store.state.auth.user;
    },
  },
  created() {
    this.__init();
  },
  mounted() {
    this.dashboard.$on('dashboard:destroy', this.onDashboardDestroy);
  },
  beforeDestroy() {
    this.dashboard.$off('dashboard:destroy', this.onDashboardDestroy);
  },
  methods: {
    __init() {
      // default
      const _default = [{ id: 0, profileName: this.$text('Default') }];
      if (this.user.op.anonymous === 1) {
        this.profiles = _default;
      } else {
        // list
        this.$api.post('profile/list').then(data => {
          this.profiles = _default.concat(data);
        });
      }
    },
    onDashboardDestroy() {
      this.$view.close();
    },
    onPerformAddGroup() {
      this.dashboard.onGroupAdd();
    },
    onPerformAddWidget() {
      this.$view.navigate('/a/dashboard/widget/add', {
        target: '_self',
        context: {
          callback: (code, data) => {
            if (code === 200) {
              this.dashboard.onWidgetsAdd(data);
            }
          },
        },
      });
    },
    onPerformNewProfile() {
      return this.$view.dialog.prompt(this.$text('Please specify the profile name')).then(profileName => {
        if (!profileName) return;
        const profile = {
          profileName,
          profileValue: null,
        }
        return this.$api.post('profile/create', {
          data: profile,
        }).then(data => {
          profile.id = data.profileId;
          this.profiles.push(profile);
          return true;
        });
      });
    },
    onPerformClone(e, item) {
      const profileId = item.id;
      if (profileId !== this.profileIdCurrent) return;
      return this.$view.dialog.prompt(this.$text('Please specify the profile name')).then(profileName => {
        if (!profileName) return;
        const profile = {
          profileName,
          profileValue: JSON.stringify(this.dashboard.profile),
        }
        return this.$api.post('profile/create', {
          data: profile,
        }).then(data => {
          profile.id = data.profileId;
          this.profiles.push(profile);
          this.$meta.util.swipeoutClose(e.target);
          return true;
        });
      });
    },
    onPerformDelete(e, item) {
      if (item.id === 0) return;
      return this.$view.dialog.confirm().then(() => {
        return this.$api.post('profile/delete', { profileId: item.id }).then(() => {
          const index = this.__getProfileIndexById(item.id);
          this.profiles.splice(index, 1);
          this.$meta.util.swipeoutClose(e.target);
          return true;
        });
      });
    },
    onPerformProfile(e, item) {
      const profileId = item.id;
      if (this.profileIdCurrent === profileId) return;
      return this.dashboard.__switchProfile(profileId).then(() => {
        this.dashboard.__saveProfileId();
        this.profileIdCurrent = profileId;
        //return true;
      });
    },
    __getProfileIndexById(profileId) {
      return this.profiles.findIndex(item => item.id === profileId);
    },
    __getProfileTitle(item) {
      return this.profileIdCurrent === item.id ? `${item.profileName} ⭐` : item.profileName;
    }
  },
}

</script>
