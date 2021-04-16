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
      await this.__normalizeAssignees();
    },
    async __normalizeAssignees() {
      this.assignees = await this.$api.post('/a/flowchart/flowDef/normalizeAssignees', {
        flowDefId: this.flowDefId,
        nodeDefId: this.nodeId,
        assignees: this.value,
      });
    },
    __getPageTitle() {
      return this.$text('Assignees');
    },
    onPerformDone() {

    },
    onPerformAddVar() {
      const flowUser = {
        name: 'flowUser',
        title: 'FlowInitiator',
        titleLocale: this.$text('FlowInitiator'),
      };
      this.assignees.vars.push(flowUser);
    },
    onPerformRemoveVar(event, item, index) {
      this.assignees.vars.splice(index, 1);
      this.$meta.util.swipeoutClose(event.target);
    },
    _renderAssignees_var(item, index) {
      // domTitle
      const domTitle = (
        <div slot="title" class="title">
          <div>{item.titleLocale}</div>
        </div>
      );
      // ok
      //   key: not use item.name
      return (
        <eb-list-item class="item" key={index} swipeout>
          {domTitle}
          {this._renderAssignees_var_ContextMenu(item, index)}
        </eb-list-item>
      );
    },
    _renderAssignees_var_ContextMenu(item, index) {
      // domRight
      const domActions = [];
      domActions.push(
        <div key='remove' color='red' propsOnPerform={event => this.onPerformRemoveVar(event, item, index)}>
          <f7-icon slot="media" material='delete'></f7-icon>
          {this.$device.desktop && <div slot="title">{this.$text('Remove')}</div>}
        </div>
      );
      const domRight = (
        <div slot="right">
          {domActions}
        </div>
      );

      return (
        <eb-context-menu>
          {domRight}
        </eb-context-menu>
      );
    },
    renderAssignees_vars() {
      const children = [];
      const items = this.assignees.vars;
      for (let index = 0; index < items.length; index++) {
        children.push(this._renderAssignees_var(items[index], index));
      }
      return (
        <f7-list-group>
          <f7-list-item group-title>
            <div class="display-flex justify-content-space-between">
              <div>{this.$text('Variables')}</div>
              <eb-link iconMaterial='add' propsOnPerform={this.onPerformAddVar}></eb-link>
            </div>
          </f7-list-item>
          {children}
        </f7-list-group>
      );
    },
    renderAssignees() {
      if (!this.ready) return;
      // list
      return (
        <eb-list form inline-labels no-hairlines-md>
          {this.renderAssignees_vars()}
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

