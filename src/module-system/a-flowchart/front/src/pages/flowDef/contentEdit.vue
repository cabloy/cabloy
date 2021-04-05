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
        <content-edit-diagram :readOnly="readOnly" :contentProcess="contentProcess"></content-edit-diagram>
      </eb-tab-page-content>
      <eb-tab-page-content :id="tabId.source" :tabActive="tabName==='source'" data-ref="source" @tab:show="tabName='source'">
      </eb-tab-page-content>
      <eb-tab-page-content :id="tabId.listener" :tabActive="tabName==='listener'" data-ref="listener" @tab:show="tabName='listener'">
      </eb-tab-page-content>
    </f7-tabs>
  </eb-page>
</template>
<script>
import Vue from 'vue';
import contentEditDiagram from '../../components/flowDef/contentEditDiagram.jsx';
const ebPageContext = Vue.prototype.$meta.module.get('a-components').options.mixins.ebPageContext;
export default {
  meta: {
    size: 'large',
  },
  mixins: [ ebPageContext ],
  components: {
    contentEditDiagram,
  },
  data() {
    return {
      dirty: false,
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
      return `${this.dirty ? '* ' : ''}${this.item.atomName}`;
    },
    readOnly() {
      return this.contextParams.readOnly;
    },
    item() {
      return this.contextParams.item;
    },
    content2() {
      return this.item.content ? JSON.parse(this.item.content) : {};
    },
    contentProcess() {
      return this.content2.process || this.$config.flowDef.default.process;
    },
    contentListener() {
      return this.content2.listener;
    },
  },
  created() {},
  methods: {
    onChange(data) {
      if (this.readOnly) return;
      if (this.item.content === data) return;
      this.dirty = true;
      this.contextCallback(200, { content: data });
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
