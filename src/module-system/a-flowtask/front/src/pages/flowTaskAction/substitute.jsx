import Vue from 'vue';
const ebPageContext = Vue.prototype.$meta.module.get('a-components').options.mixins.ebPageContext;
export default {
  mixins: [ebPageContext],
  data() {
    return {
      selectedUser: null,
      remark: null,
    };
  },
  computed: {
    flowTaskId() {
      return this.contextParams.flowTaskId;
    },
  },
  created() {},
  methods: {
    onFormSubmit() {
      this.$refs.buttonSubmit && this.$refs.buttonSubmit.onClick();
    },
    onPerformSelectUser() {
      this.$view.navigate('/a/baseadmin/user/select', {
        target: '_self',
        context: {
          params: {
            onFetchUsers: ({ query, page }) => {
              return this.$api.post('/a/flowtask/task/userSelectSubstitute', {
                flowTaskId: this.flowTaskId,
                params: {
                  query,
                  page,
                },
              });
            },
          },
          callback: (code, data) => {
            if (code === 200) {
              this.selectedUser = data;
            }
          },
        },
      });
    },
    async onPerformDone() {
      await this.$view.dialog.confirm();
      await this.$api.post('/a/flowtask/task/substitute', {
        flowTaskId: this.flowTaskId,
        handle: {
          assignee: this.selectedUser.id,
          remark: this.remark,
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
    _renderForm() {
      return (
        <eb-list form inline-labels no-hairlines-md onSubmit={event => this.onFormSubmit(event)}>
          <eb-list-item title={this.$text('Assignee')} link="#" propsOnPerform={this.onPerformSelectUser}>
            <div slot="after" class="after">
              {this.selectedUser && this.selectedUser.userName}
            </div>
          </eb-list-item>
          <eb-list-input
            label={this.$text('Remark')}
            type="text"
            clear-button
            placeholder={this.$text('Remark')}
            v-model={this.remark}
          ></eb-list-input>
        </eb-list>
      );
    },
  },
  render() {
    let domDone;
    if (this.selectedUser) {
      domDone = <eb-link ref="buttonSubmit" iconMaterial="done" propsOnPerform={this.onPerformDone}></eb-link>;
    }
    return (
      <eb-page>
        <eb-navbar title={this.$text('TaskActionTitleSubstitute')} eb-back-link="Back">
          <f7-nav-right>{domDone}</f7-nav-right>
        </eb-navbar>
        {this._renderForm()}
      </eb-page>
    );
  },
};
