<template>
  <eb-page :page-content="false" tabs with-subnavbar>
    <eb-navbar :title="title" eb-back-link="Back">
      <f7-nav-right>
        <eb-link v-if="!readOnly" iconMaterial="save" :onPerform="onPerformSave"></eb-link>
      </f7-nav-right>
      <f7-subnavbar>
        <f7-toolbar top tabbar>
          <eb-link :tab-link="`#${tabId.diagram}`" :tabLinkActive="tabName==='diagram'" :text="$text('flowDefDiagramTitle')"></eb-link>
          <eb-link :tab-link="`#${tabId.source}`" :tabLinkActive="tabName==='source'" :text="$text('flowDefSourceTitle')"></eb-link>
          <eb-link :tab-link="`#${tabId.listener}`" :tabLinkActive="tabName==='listener'" :text="$text('flowDefListenerTitle')"></eb-link>
        </f7-toolbar>
      </f7-subnavbar>
    </eb-navbar>
    <f7-tabs ref="tabs">
      <eb-tab-page-content :id="tabId.diagram" :ptr="false" :infinite="false" :tabActive="tabName==='diagram'" data-ref="diagram" @tab:show="tabName='diagram'">
        <content-edit-diagram :readOnly="readOnly" :tabActive="tabName==='diagram'" :flowDef="flowDef" :contentProcessStr="contentProcessStr" @contentChange="onContentChange"></content-edit-diagram>
      </eb-tab-page-content>
      <eb-tab-page-content :id="tabId.source" :ptr="false" :infinite="false" :tabActive="tabName==='source'" data-ref="source" @tab:show="tabName='source'">
        <content-edit-source :readOnly="readOnly" :contentProcessStr="contentProcessStr" @contentChange="onContentChange"></content-edit-source>
      </eb-tab-page-content>
      <eb-tab-page-content :id="tabId.listener" :ptr="false" :infinite="false" :tabActive="tabName==='listener'" data-ref="listener" @tab:show="tabName='listener'">
        <content-edit-listener :readOnly="readOnly" :contentListener="contentListener" @contentChange="onContentChange"></content-edit-listener>
      </eb-tab-page-content>
    </f7-tabs>
  </eb-page>
</template>
<script>
import Vue from 'vue';
import contentEditDiagram from '../../components/flowDef/contentEditDiagram.jsx';
import contentEditSource from '../../components/flowDef/contentEditSource.jsx';
import contentEditListener from '../../components/flowDef/contentEditListener.jsx';
const ebPageContext = Vue.prototype.$meta.module.get('a-components').options.mixins.ebPageContext;
export default {
  meta: {
    size: 'large',
  },
  mixins: [ ebPageContext ],
  components: {
    contentEditDiagram,
    contentEditSource,
    contentEditListener,
  },
  data() {
    return {
      dirty: false,
      contentProcess: null,
      contentProcessStr: null,
      contentListener: null,
      tabId: {
        diagram: Vue.prototype.$meta.util.nextId('tab'),
        source: Vue.prototype.$meta.util.nextId('tab'),
        listener: Vue.prototype.$meta.util.nextId('tab'),
      },
      tabName: 'diagram',
    };
  },
  computed: {
    title() {
      return `${this.dirty ? '* ' : ''}${this.flowDef.atomName}`;
    },
    readOnly() {
      return this.contextParams.readOnly;
    },
    flowDef() {
      return this.contextParams.item;
    },
    flowDefId() {
      return this.flowDef.atomId;
    },
    contentObj() {
      return this.flowDef.content ? JSON.parse(this.flowDef.content) : {};
    },
  },
  created() {
    const content = this.contentObj;
    this.contentProcess = content.process || this.$config.flowDef.default.process;
    this.contentProcessStr = JSON5.stringify(this.contentProcess, null, 2);
    this.contentListener = content.listener || this.$config.flowDef.default.listener;
  },
  methods: {
    onContentChange(data) {
      if (this.readOnly) return;
      const contentNew = {};
      if (data.type === 'process') {
        this.contentProcess = data.value;
        contentNew.process = data.value;
        if (data.valueStr) {
          this.contentProcessStr = data.valueStr;
        } else {
          this.contentProcessStr = JSON5.stringify(this.contentProcess, null, 2);
        }
      } else if (data.type === 'listener') {
        this.contentListener = data.value;
        contentNew.listener = data.value;
      }
      const content = JSON.stringify(this.$meta.util.extend({}, this.contentObj, contentNew));
      this.dirty = true;
      this.contextCallback(200, { content });
    },
    onSave() {
      this.onPerformSave().then(text => {
        this.$view.toast.show({ text });
      }).catch(err => {
        this.$view.toast.show({ text: err.message });
      });
    },
    onPerformSave() {
      return this.contextParams.ctx.save().then(() => {
        this.dirty = false;
        return this.$text('Saved');
      });
    },
  },
};

</script>
