import Vue from 'vue';
import assigneesVars from '../../components/assignees/vars.jsx';
import assigneesRoles from '../../components/assignees/roles.jsx';
import assigneesUsers from '../../components/assignees/users.jsx';

const ebPageContext = Vue.prototype.$meta.module.get('a-components').options.mixins.ebPageContext;
const ebPageDirty = Vue.prototype.$meta.module.get('a-components').options.mixins.ebPageDirty;
export default {
  mixins: [ebPageContext, ebPageDirty],
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
      ready: false,
    };
  },
  computed: {
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
    page_title() {
      return this.page_getDirtyTitle(this.$text('Assignees'));
    },
  },
  watch: {
    assignees: {
      handler() {
        if (!this.ready) return;
        this.page_setDirty(true);
      },
      deep: true,
    },
  },
  created() {
    this.__load();
  },
  methods: {
    async __load() {
      // data
      await this.__normalizeAssignees();
      this.ready = true;
    },
    async __normalizeAssignees() {
      this.assignees = await this.$api.post('/a/flowchart/flowDef/normalizeAssignees', {
        host: this.host,
        assignees: this.value,
      });
    },
    onPerformDone() {
      const assignees = {};
      // users
      if (this.assignees.users.length > 0) {
        assignees.users = this.assignees.users.map(item => {
          return {
            id: item.id,
            userName: item.userName,
          };
        });
      }
      // roles
      if (this.assignees.roles.length > 0) {
        assignees.roles = this.assignees.roles.map(item => {
          return {
            id: item.id,
            roleName: item.roleName,
          };
        });
      }
      // vars
      if (this.assignees.vars.length > 0) {
        assignees.vars = this.assignees.vars.map(item => {
          return item.name;
        });
      }
      // ok
      this.contextCallback(200, assignees);
      this.page_setDirty(false);
      this.$f7router.back();
    },
    renderAssignees() {
      if (!this.ready) return;
      // list
      return (
        <eb-list form inline-labels no-hairlines-md>
          <assignees-vars readOnly={this.readOnly} assignees={this.assignees}></assignees-vars>
          <assignees-roles readOnly={this.readOnly} assignees={this.assignees} host={this.host}></assignees-roles>
          <assignees-users readOnly={this.readOnly} assignees={this.assignees} host={this.host}></assignees-users>
        </eb-list>
      );
    },
  },
  render() {
    let domDone;
    if (!this.readOnly) {
      domDone = <eb-link iconMaterial="done" propsOnPerform={this.onPerformDone}></eb-link>;
    }
    return (
      <eb-page>
        <eb-navbar title={this.page_title} eb-back-link="Back">
          <f7-nav-right>{domDone}</f7-nav-right>
        </eb-navbar>
        {this.renderAssignees()}
      </eb-page>
    );
  },
};
