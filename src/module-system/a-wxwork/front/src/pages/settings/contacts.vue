<template>
  <eb-page>
    <eb-navbar large largeTransparent :title="$text('Contacts Management')" eb-back-link="Back"> </eb-navbar>
    <f7-list>
      <f7-list-group>
        <f7-list-item group-title :title="$text('Department')"></f7-list-item>
        <eb-list-item link="#" :title="$text('Sync Remote -> Local (Incremental)')" :onPerform="onPerformDepartmentSyncIncremental"></eb-list-item>
        <eb-list-item link="#" :title="$text('Sync Remote -> Local (Full)')"></eb-list-item>
      </f7-list-group>
      <f7-list-group>
        <f7-list-item group-title :title="$text('Member')"></f7-list-item>
        <eb-list-item link="#" :title="$text('Sync Remote -> Local (Incremental)')"></eb-list-item>
        <eb-list-item link="#" :title="$text('Sync Remote -> Local (Full)')"></eb-list-item>
      </f7-list-group>
    </f7-list>
  </eb-page>
</template>
<script>
export default {
  data() {
    return {};
  },
  methods: {
    onPerformDepartmentSyncIncremental() {
      console.log('---sync');
    },
  },
};

</script>
