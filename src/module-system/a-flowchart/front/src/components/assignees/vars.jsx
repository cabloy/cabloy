export default {
  props: {
    readOnly: {
      type: Boolean,
    },
    assignees: {
      type: Object,
    },
  },
  data() {
    return {};
  },
  methods: {
    onPerformAdd() {
      const _var = this.assignees.vars.find(item => item.name === 'flowUser');
      if (!_var) {
        const flowUser = {
          name: 'flowUser',
          title: 'FlowInitiator',
          titleLocale: this.$text('FlowInitiator'),
        };
        this.assignees.vars.push(flowUser);
      }
    },
    onPerformRemove(event, item, index) {
      this.assignees.vars.splice(index, 1);
      this.$meta.util.swipeoutClose(event.currentTarget);
    },
    _renderAssignee(item, index) {
      // domTitle
      const domTitle = (
        <div slot="title" class="title">
          <div>{item.titleLocale}</div>
        </div>
      );
      // ok
      //   key: not use item.name
      return (
        <eb-list-item class="item" key={index} swipeout={!this.readOnly}>
          {domTitle}
          {this._renderAssigneeContextMenu(item, index)}
        </eb-list-item>
      );
    },
    _renderAssigneeContextMenu(item, index) {
      if (this.readOnly) return null;
      // domRight
      const domActions = [];
      domActions.push(
        <div key="remove" color="red" propsOnPerform={event => this.onPerformRemove(event, item, index)}>
          <f7-icon slot="media" f7="::delete"></f7-icon>
          {this.$device.desktop && <div slot="title">{this.$text('Remove')}</div>}
        </div>
      );
      const domRight = <div slot="right">{domActions}</div>;

      return <eb-context-menu>{domRight}</eb-context-menu>;
    },
    renderAssignees() {
      const children = [];
      const items = this.assignees.vars;
      for (let index = 0; index < items.length; index++) {
        children.push(this._renderAssignee(items[index], index));
      }
      return children;
    },
  },
  render() {
    let domAdd;
    if (!this.readOnly) {
      domAdd = <eb-link iconF7="::add" propsOnPerform={this.onPerformAdd}></eb-link>;
    }
    return (
      <f7-list-group>
        <f7-list-item group-title>
          <div class="display-flex justify-content-space-between">
            <div>{this.$text('Variables')}</div>
            {domAdd}
          </div>
        </f7-list-item>
        {this.renderAssignees()}
      </f7-list-group>
    );
  },
};
