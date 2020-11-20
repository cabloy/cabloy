export default {
  data() {
    return {
      flowLayoutManager: null,
      flowTaskId: 0,
      remark: '',
    };
  },
  methods: {
    onFormSubmit() {
      this.$refs.buttonSubmit.onClick();
    },
    async onSubmit() {
      await this.$view.dialog.confirm(this.$text('CancelFlowPrompt'));
      await this.$api.post('/a/flowtask/task/cancelFlow', {
        flowTaskId: this.flowTaskId,
        handle: {
          remark: this.remark,
        },
      });
      await this.flowLayoutManager.base_loadData();
      // close
      this.$refs.sheet.f7Sheet.close(false);
      // check
      if (this.$f7route.path === '/a/flowtask/flowTaskAtom') {
        this.$f7router.back();
      }
    },
    open({ flowLayoutManager, flowTaskId }) {
      this.flowLayoutManager = flowLayoutManager;
      this.flowTaskId = flowTaskId;
      this.$refs.sheet.f7Sheet.open();
    },
  },
  render() {
    return (
      <f7-sheet ref="sheet" fill>
        <f7-toolbar>
          <div class="left">
          </div>
          <div class="right">
            <eb-link ref="buttonSubmit" propsOnPerform={event => this.onSubmit(event)}>{this.$text('Cancel Flow')}</eb-link>
          </div>
        </f7-toolbar>
        <f7-page-content>
          <eb-list form inline-labels no-hairlines-md onSubmit={event => this.onFormSubmit(event)}>
            <eb-list-input label={this.$text('Remark')} type="text" clear-button placeholder={this.$text('Remark')} v-model={this.remark}>
            </eb-list-input>
          </eb-list>
        </f7-page-content>
      </f7-sheet>
    );
  },
};
