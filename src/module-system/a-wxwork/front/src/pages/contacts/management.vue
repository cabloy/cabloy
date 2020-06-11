<template>
  <eb-page>
    <eb-navbar large largeTransparent :title="$text('Contacts Management')" eb-back-link="Back"> </eb-navbar>
    <f7-list>
      <f7-list-group>
        <f7-list-item group-title :title="$text('Departments')"></f7-list-item>
        <eb-list-item link="#" eb-href="contacts/sync?type=departments&mode=inc" :title="$text('Sync Remote -> Local (Incremental)')"></eb-list-item>
        <eb-list-item link="#" eb-href="contacts/sync?type=departments&mode=full" :title="$text('Sync Remote -> Local (Full)')"></eb-list-item>
      </f7-list-group>
      <f7-list-group>
        <f7-list-item group-title :title="$text('Members')"></f7-list-item>
        <eb-list-item link="#" eb-href="contacts/sync?type=members&mode=inc" :title="$text('Sync Remote -> Local (Incremental)')"></eb-list-item>
        <eb-list-item link="#" eb-href="contacts/sync?type=members&mode=full" :title="$text('Sync Remote -> Local (Full)')"></eb-list-item>
      </f7-list-group>
    </f7-list>
  </eb-page>
</template>
<script>
export default {
  data() {
    return {};
  },
};

</script>
