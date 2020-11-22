export default {
  data() {
    return {
      flowLayoutManager: null,
      flowTaskId: 0,
      action: null,
      remark: '',
      callback: null,
    };
  },
  methods: {
    onFormSubmit() {
      // this.$refs.buttonSubmit.onClick();
    },
    async onSubmit(event, status) {
      // close
      this.$refs.sheet.f7Sheet.close(false);
      // submit
      await this._submit(event, status);
    },
    async _submit(event, status) {
      // callback
      await this.callback(event, async data => {
        // prompt
        if (status) {
          await this.$view.dialog.confirm(this.$text(status === 1 ? 'TaskPassPrompt' : 'TaskRejectPrompt'));
        }
        // params
        const params = {
          flowTaskId: this.flowTaskId,
        };
        // handle
        if (status) {
          params.handle = {
            status,
            remark: this.remark,
          };
        }
        // formAtom
        if (data && data.formAtom) {
          params.formAtom = data.formAtom;
        }
        // complete
        await this.$api.post('/a/flowtask/task/complete', params);
        // load flow & atom
        await this.flowLayoutManager.base_loadData();
        // back
        if (status) {
          if (this.$f7route.path === '/a/flowtask/flowTaskAtom') {
            this.$f7router.back();
          }
        }
      });
    },
    async open({ flowLayoutManager, flowTaskId, action, callback, submitDirectly }) {
      this.flowLayoutManager = flowLayoutManager;
      this.flowTaskId = flowTaskId;
      this.action = action;
      this.callback = callback;
      if (submitDirectly) {
        await this._submit(null, null);
      } else {
        this.$refs.sheet.f7Sheet.open();
      }
    },
  },
  render() {
    let domButtonPass;
    if (this.action && this.action.options.allowPassTask) {
      domButtonPass = (
        <eb-link ref="buttonSubmitPass" propsOnPerform={event => this.onSubmit(event, 1)}>{this.$text('Pass')}</eb-link>
      );
    }
    let domButtonReject;
    if (this.action && this.action.options.allowRejectTask) {
      domButtonReject = (
        <eb-link ref="buttonSubmitReject" propsOnPerform={event => this.onSubmit(event, 2)}>{this.$text('Reject')}</eb-link>
      );
    }
    return (
      <f7-sheet ref="sheet" fill>
        <f7-toolbar>
          <div class="left">
          </div>
          <div class="right display-flex align-items-center">
            {domButtonPass}
            {domButtonReject}
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
