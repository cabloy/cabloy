export default {
  data() {
    return {
      atomLayoutManager: null,
      flowLayoutManager: null,
      flowTaskId: 0,
      action: null,
      remark: '',
      callback: null,
      pathThis: null,
    };
  },
  created() {
    this.pathThis = this.$f7route.path;
  },
  beforeDestroy() {
    this.atomLayoutManager = null;
    this.flowLayoutManager = null;
    this.callback = null;
  },
  methods: {
    onFormSubmit() {
      // this.$refs.buttonSubmit.onClick();
    },
    async onSubmit(event, status) {
      // prompt
      await this.$view.dialog.confirm(this.$text(status === 1 ? 'TaskPassPrompt' : 'TaskRejectPrompt'));
      // close
      this.$refs.sheet.f7Sheet.close(false);
      // handle
      const handle = {
        status,
        remark: this.remark,
      };
      // callback
      if (this.callback) {
        return await this.callback({ handle });
      }
      // default submit
      return await this._submit({ handle, formAtom: null });
    },
    async _submit({ handle, formAtom }) {
      // params
      const params = {
        flowTaskId: this.flowTaskId,
      };
      // handle
      if (handle) {
        params.handle = handle;
      }
      // formAtom
      if (formAtom) {
        params.formAtom = formAtom;
      }
      // complete
      await this.$api.post('/a/flowtask/task/complete', params);
      // update draft
      this.flowLayoutManager.base_emitAtomActionSave();
      // load flow & atom
      await this.flowLayoutManager.base_loadData_autoCheck();
      // pageDirty : save/submit(pass/reject)
      if (this.atomLayoutManager) {
        this.atomLayoutManager.page_setDirty(false);
      }
      // back
      if (handle) {
        if (this.pathThis === '/a/flowtask/flowTaskAtom') {
          // check AssigneesConfirmation
          if (!this.flowLayoutManager.base_checkAssigneesConfirmation()) {
            this.$f7router.back();
          }
        }
      }
    },
    init({ atomLayoutManager, flowLayoutManager, flowTaskId, action, callback }) {
      this.atomLayoutManager = atomLayoutManager;
      this.flowLayoutManager = flowLayoutManager;
      this.flowTaskId = flowTaskId;
      this.action = action;
      this.callback = callback;
    },
    open({ atomLayoutManager, flowLayoutManager, flowTaskId, action, callback }) {
      this.init({ atomLayoutManager, flowLayoutManager, flowTaskId, action, callback });
      this.$refs.sheet.f7Sheet.open();
    },
  },
  render() {
    let domButtonPass;
    if (this.action && this.action.options.allowPassTask) {
      domButtonPass = (
        <eb-link ref="buttonSubmitPass" propsOnPerform={event => this.onSubmit(event, 1)}>
          {this.$text('Pass')}
        </eb-link>
      );
    }
    let domButtonReject;
    if (this.action && this.action.options.allowRejectTask) {
      domButtonReject = (
        <eb-link ref="buttonSubmitReject" propsOnPerform={event => this.onSubmit(event, 2)}>
          {this.$text('Reject')}
        </eb-link>
      );
    }
    return (
      <f7-sheet ref="sheet" fill>
        <f7-toolbar>
          <div class="left"></div>
          <div class="right display-flex align-items-center">
            {domButtonPass}
            {domButtonReject}
          </div>
        </f7-toolbar>
        <f7-page-content>
          <eb-list form inline-labels no-hairlines-md onSubmit={event => this.onFormSubmit(event)}>
            <eb-list-input
              label={this.$text('Remark')}
              type="text"
              clear-button
              placeholder={this.$text('Remark')}
              v-model={this.remark}
            ></eb-list-input>
          </eb-list>
        </f7-page-content>
      </f7-sheet>
    );
  },
};
