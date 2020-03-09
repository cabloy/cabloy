<template>
  <eb-page>
    <eb-navbar :title="$text('Profile2')" eb-back-link="Back">
      <f7-nav-right>
        <eb-link iconMaterial="add" :onPerform="onPerformAddWidget"></eb-link>
      </f7-nav-right>
    </eb-navbar>
    <f7-list>
      <eb-list-item v-for="item of profiles" :key="item.id" :title="item.profileName" swipeout>
        <eb-context-menu>
          <div slot="right">
            <div color="orange" :context="item" :onPerform="onPerformClone">{{$text('Clone')}}</div>
            <div v-if="!!item.id" color="red" :context="item" :onPerform="onPerformDelete">{{$text('Delete')}}</div>
          </div>
        </eb-context-menu>
      </eb-list-item>
    </f7-list>
    <f7-toolbar bottom-md>
      <f7-button></f7-button>
      <f7-button></f7-button>
      <eb-button :onPerform="onPerformNewProfile">{{$text('New Profile')}}</eb-button>
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
      profiles: null,
    };
  },
  computed: {
    dashboard() {
      return this.contextParams.dashboard;
    },
  },
  created() {
    // list
    this.$api.post('profile/list').then(data => {
      const _default = [{ id: 0, profileName: this.$text('Default') }];
      this.profiles = _default.concat(data);
    });
  },
  methods: {
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
      this.$view.dialog.prompt(this.$text('Please specify the profile name')).then(profileName => {
        if (!profileName) return;
        const profile = {
          profileName,
          profileValue: null,
        }
        this.$api.post('profile/create', {
          data: profile,
        }).then(data => {
          profile.id = data.profileId;
          this.profiles.push(profile);
        });
      }).catch(() => {});
    },
    onPerformClone(e, item) {
      // return this.$api.post('auth/disable', { id: item.id, disabled }).then(() => {
      //   const index = this.items.findIndex(_item => _item.id === item.id);
      //   this.items[index].disabled = disabled;
      //   this.$meta.util.swipeoutClose(event.target);
      //   return true;
      // });
    },
    onPerformDelete(e, item) {

    },
  },
}

</script>
