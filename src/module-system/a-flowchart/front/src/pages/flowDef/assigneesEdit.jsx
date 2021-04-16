import Vue from 'vue';
import assigneesVars from '../../components/assignees/vars.jsx';
import assigneesRoles from '../../components/assignees/roles.jsx';
import assigneesUsers from '../../components/assignees/users.jsx';

const ebPageContext = Vue.prototype.$meta.module.get('a-components').options.mixins.ebPageContext;
export default {
  mixins: [ ebPageContext ],
  components: {
    assigneesVars,
    assigneesRoles,
    assigneesUsers,
  },
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
      // data
      await this.__normalizeAssignees();
    },
    async __normalizeAssignees() {
      this.assignees = await this.$api.post('/a/flowchart/flowDef/normalizeAssignees', {
        host: this.host,
        assignees: this.value,
      });
    },
    __getPageTitle() {
      return this.$text('Assignees');
    },
    onPerformDone() {

    },
    renderAssignees() {
      if (!this.ready) return;
      // list
      return (
        <eb-list form inline-labels no-hairlines-md>
          <assignees-vars assignees={this.assignees}></assignees-vars>
          <assignees-roles assignees={this.assignees} host={this.host}></assignees-roles>
          <assignees-users assignees={this.assignees} host={this.host}></assignees-users>
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
        {this.renderAssignees()}
      </eb-page>
    );
  },
};

