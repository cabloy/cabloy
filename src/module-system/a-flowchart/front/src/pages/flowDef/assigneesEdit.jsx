import Vue from 'vue';
const ebPageContext = Vue.prototype.$meta.module.get('a-components').options.mixins.ebPageContext;
export default {
  mixins: [ ebPageContext ],
  data() {
    return {
      flowDefId: this.$f7route.query.flowDefId,
      nodeId: this.$f7route.query.nodeId,
    };
  },
  computed: {
    ready() {
      return false;
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
    __parseAssignees() {

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

