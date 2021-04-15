import Vue from 'vue';
const ebPageContext = Vue.prototype.$meta.module.get('a-components').options.mixins.ebPageContext;
export default {
  mixins: [ ebPageContext ],
  data() {
    return {
      flowDefId: parseInt(this.$f7route.query.flowDefId),
      nodeId: this.$f7route.query.nodeId,
      assignees: null,
    };
  },
  computed: {
    ready() {
      return !!this.assignees;
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
  },
  created() {
    this.__load();
  },
  methods: {
    async __load() {
      // data
      await this.__parseAssignees();
    },
    async __parseAssignees() {
      this.assignees = await this.$api.post('/a/flowchart/flowDef/parseAssignees', {
        flowDefId: this.flowDefId,
        nodeId: this.nodeId,
        assignees: this.value,
      });
    },
    __getPageTitle() {
      return this.$text('Assignees');
    },
    onPerformDone() {

    },
  },
  render() {
    return (
      <eb-page>
        <eb-navbar title={this.__getPageTitle()} eb-back-link="Back">
          <f7-nav-right>
            <eb-link iconMaterial="done" propsOnPerform={this.onPerformDone}></eb-link>
          </f7-nav-right>
        </eb-navbar>
      </eb-page>
    );
  },
};

