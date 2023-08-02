<template>
  <eb-page :page-content="false" tabs with-subnavbar>
    <eb-navbar :title="title" eb-back-link="Back">
      <f7-nav-right>
        <eb-link v-if="!readOnly" iconF7="::done" :onPerform="onPerformDone"></eb-link>
        <eb-link v-if="!!schemaReference" iconF7="::info-circle" :onPerform="onPerformInfo"></eb-link>
      </f7-nav-right>
      <f7-subnavbar>
        <f7-toolbar top tabbar>
          <eb-link :tab-link="`#${tabId.read}`" :tabLinkActive="tabName === 'read'" :text="$text('Read')"></eb-link>
          <eb-link :tab-link="`#${tabId.write}`" :tabLinkActive="tabName === 'write'" :text="$text('Write')"></eb-link>
        </f7-toolbar>
      </f7-subnavbar>
    </eb-navbar>
    <f7-tabs ref="tabs">
      <eb-tab-page-content
        :id="tabId.read"
        :ptr="false"
        :infinite="false"
        :tabActive="tabName === 'read'"
        data-ref="read"
        @tab:show="tabName = 'read'"
      >
        <schema-fields-tab
          :context="context"
          :readOnly="readOnly"
          mode="read"
          :valueSchema="valueSchema"
          :schemaReference="schemaReference"
        ></schema-fields-tab>
      </eb-tab-page-content>
      <eb-tab-page-content
        :id="tabId.write"
        :ptr="false"
        :infinite="false"
        :tabActive="tabName === 'write'"
        data-ref="write"
        @tab:show="tabName = 'write'"
      >
        <schema-fields-tab
          :context="context"
          :readOnly="readOnly"
          mode="write"
          :valueSchema="valueSchema"
          :schemaReference="schemaReference"
        ></schema-fields-tab>
      </eb-tab-page-content>
    </f7-tabs>
  </eb-page>
</template>
<script>
import Vue from 'vue';
import schemaFieldsTab from '../../components/fields/schemaFieldsTab.jsx';
const ebPageContext = Vue.prototype.$meta.module.get('a-components').options.mixins.ebPageContext;
export default {
  mixins: [ebPageContext],
  components: {
    schemaFieldsTab,
  },
  data() {
    return {
      flowDefId: parseInt(this.$f7route.query.flowDefId),
      nodeId: this.$f7route.query.nodeId,
      valueSchema: null,
      tabId: {
        read: Vue.prototype.$meta.util.nextId('tab'),
        write: Vue.prototype.$meta.util.nextId('tab'),
      },
      tabName: 'read',
    };
  },
  computed: {
    title() {
      return this.$text('Field Permissions');
    },
    context() {
      return this.contextParams.context;
    },
    readOnly() {
      return this.contextParams.readOnly;
    },
    value() {
      return this.contextParams.value;
    },
    schemaReference() {
      return this.contextParams.schemaReference;
    },
  },
  created() {
    this.valueSchema = this.value;
  },
  methods: {
    onPerformDone() {
      // ok
      this.contextCallback(200, this.valueSchema);
      this.$f7router.back();
    },
    onPerformInfo() {
      // navigate
      this.$view.navigate(`/a/jsoneditor/json/editor?t=${Date.now()}`, {
        target: '_self',
        context: {
          params: {
            value: this.schemaReference.schema,
            title: this.$text('ReferenceForHelp'),
            readOnly: true,
          },
        },
      });
    },
  },
};
</script>
