import Vue from 'vue';

const ebPageContext = Vue.prototype.$meta.module.get('a-components').options.mixins.ebPageContext;
export default {
  mixins: [ ebPageContext ],
  components: {
  },
  data() {
    return {
      flowDefId: parseInt(this.$f7route.query.flowDefId),
      nodeId: this.$f7route.query.nodeId,
    };
  },
  computed: {
    ready() {
      return true;
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
    host() {
      return {
        flowDefId: this.flowDefId,
        nodeDefId: this.nodeId,
      };
    },
  },
  created() {
    this.__load();
  },
  methods: {
    async __load() {
    },
    __getPageTitle() {
      return this.$text('Field Permissions');
    },
    onPerformDone() {
      // ok
      // this.context.setValue(assignees);
      this.$f7router.back();
    },
    renderSchemaFields() {
      if (!this.ready) return;
      // list
      return (
        <eb-list form inline-labels no-hairlines-md>
        </eb-list>
      );
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
        {this.renderSchemaFields()}
      </eb-page>
    );
  },
};

