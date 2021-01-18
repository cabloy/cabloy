<template>
  <eb-page>
    <eb-navbar large largeTransparent :title="$text('Stats')" eb-back-link="Back"></eb-navbar>
    <eb-list no-hairlines-md>
      <eb-list-item :title="$text('Tasks')">
        <div slot="after">
          <eb-stats :stats_params="{module:'test-party', name:'tasksUser'}" stats_color="orange" :stats_default="0"></eb-stats>
        </div>
      </eb-list-item>
      <eb-list-item :title="`- ${$text('Department')}`">
        <div slot="after">
          <eb-stats :stats_params="{module:'test-party', name:'tasksUser', nameSub:'department'}"></eb-stats>
        </div>
      </eb-list-item>
      <eb-list-item :title="`- - ${$text('Project')}`">
        <div slot="after">
          <eb-link :onPerform="onPerformPlus">+1</eb-link>
          <eb-stats :stats_params="{module:'test-party', name:'tasksUser', nameSub:'department.project'}"></eb-stats>
        </div>
      </eb-list-item>
    </eb-list>
  </eb-page>
</template>
<script>
export default {
  data() {
    return {
      localeCurrent: null,
    };
  },
  created() {
    this.localeCurrent = this.$meta.util.getLocale();
  },
  methods: {
    async onPerformPlus() {
      await this.$api.post('test/feat/stats/plus');
    },
  },
};

</script>
