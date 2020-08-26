<template>
  <eb-page>
    <eb-navbar large largeTransparent :title="$text('Contacts Management')" eb-back-link="Back"> </eb-navbar>
    <f7-list v-if="syncStatus" form inline-labels no-hairlines-md>
      <f7-list-group>
        <f7-list-item group-title :title="$text('Departments')"></f7-list-item>
        <eb-list-item link="#" eb-href="contacts/sync?type=departments" :title="$text('Sync Remote -> Local')">
          <div slot="after" class="after">
            <f7-badge>{{syncStatus.departments?$text('Synchronized'):$text('Not Synchronized')}}</f7-badge>
          </div>
        </eb-list-item>
      </f7-list-group>
      <f7-list-group>
        <f7-list-item group-title :title="$text('Members')"></f7-list-item>
        <eb-list-item link="#" eb-href="contacts/sync?type=members" :title="$text('Sync Remote -> Local')">
          <div slot="after" class="after">
            <f7-badge>{{syncStatus.members?$text('Synchronized'):$text('Not Synchronized')}}</f7-badge>
          </div>
        </eb-list-item>
      </f7-list-group>
    </f7-list>
  </eb-page>
</template>
<script>
import syncStatus from '../../common/syncStatus.js';
export default {
  mixins: [syncStatus],
  data() {
    return {};
  },
};

</script>
