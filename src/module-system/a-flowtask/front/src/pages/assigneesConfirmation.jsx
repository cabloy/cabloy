import Vue from 'vue';
const ebPageContext = Vue.prototype.$meta.module.get('a-components').options.mixins.ebPageContext;
export default {
  mixins: [ebPageContext],
  data() {
    return {
      selectedUsers: null,
    };
  },
  computed: {
    flowTaskId() {
      return this.contextParams.flowTaskId;
    },
    assignees() {
      return this.contextParams.assignees;
    },
  },
  created() {
    this.selectedUsers = this.assignees.users.map(user => user.id);
  },
  methods: {
    async onPerform(event, status) {
      await this.$view.dialog.confirm();
      await this.$api.post('/a/flowtask/task/assigneesConfirmation', {
        flowTaskId: this.flowTaskId,
        handle: {
          status,
          assignees:
            status === 1
              ? {
                  users: this.selectedUsers,
                }
              : undefined,
        },
      });
      this.contextCallback(200, true);
      this.$f7router.back();
    },
    onItemChange(event, item) {
      const index = this.selectedUsers.findIndex(_item => _item === item.id);
      if (event.target.checked && index === -1) {
        this.selectedUsers.push(item.id);
      } else if (!event.target.checked && index > -1) {
        this.selectedUsers.splice(index, 1);
      }
    },
    _getItemChecked(item) {
      const index = this.selectedUsers.findIndex(_item => _item === item.id);
      return index > -1;
    },
    _getItemMetaMedia(item) {
      const media = item.avatar || this.$meta.config.modules['a-base'].user.avatar.default;
      return this.$meta.util.combineImageUrl(media, 24);
    },
    renderUsers() {
      const users = this.assignees.users;
      const children = [];
      for (const user of users) {
        children.push(
          <eb-list-item class="item" key={user.id} checkbox checked={this._getItemChecked(user)} onChange={event => this.onItemChange(event, user)}>
            <div slot="title" class="display-flex align-items-center">
              <img class="avatar avatar24" src={this._getItemMetaMedia(user)} />
              <span>{user.userName}</span>
            </div>
          </eb-list-item>
        );
      }
      return <f7-list>{children}</f7-list>;
    },
  },
  render() {
    let domPass;
    if (this.selectedUsers.length > 0) {
      domPass = <eb-link propsOnPerform={event => this.onPerform(event, 1)}>{this.$text('Pass')}</eb-link>;
    }
    return (
      <eb-page>
        <eb-navbar title={this.$text('Assignees Confirmation')} eb-back-link="Back">
          <f7-nav-right>
            {domPass}
            <eb-link propsOnPerform={event => this.onPerform(event, 2)}>{this.$text('Reject')}</eb-link>
          </f7-nav-right>
        </eb-navbar>
        {this.renderUsers()}
      </eb-page>
    );
  },
};
