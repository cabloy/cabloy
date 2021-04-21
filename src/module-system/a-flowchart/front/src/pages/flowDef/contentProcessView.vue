<template>
  <eb-page>
    <eb-navbar :title="title" eb-back-link="Back">
    </eb-navbar>
    <content-edit-diagram :viewOnly="true" :readOnly="true" :tabActive="true" :contentProcessStr="contentProcessStr" :flowNodeDefIds="flowNodeDefIds"></content-edit-diagram>
  </eb-page>
</template>
<script>
import Vue from 'vue';
import contentEditDiagram from '../../components/flowDef/contentEditDiagram.jsx';
const ebPageContext = Vue.prototype.$meta.module.get('a-components').options.mixins.ebPageContext;
export default {
  mixins: [ ebPageContext ],
  components: {
    contentEditDiagram,
  },
  data() {
    return {};
  },
  computed: {
    title() {
      return this.$text('Flow Chart');
    },
    contentProcess() {
      return this.contextParams.contentProcess;
    },
    contentProcessStr() {
      return window.JSON5.stringify(this.contentProcess, null, 2);
    },
    flowNodeDefIds() {
      return this.contextParams.flowNodeDefIds;
    },
  },
  created() {},
  methods: {},
};

</script>
