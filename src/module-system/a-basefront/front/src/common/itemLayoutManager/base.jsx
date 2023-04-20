export default {
  data() {
    return {
      base: {
        configAtomBase: null,
        configAtomCms: null,
        configAtom: null,
        //
        item: null,
        atomClass: null,
        atomClassBase: null,
        module: null,
        validateParams: null,
      },
    };
  },
  computed: {
    base_ready() {
      return this.base.ready && this.base_userLabels && this.atomClassesAll && this.actionsAll;
    },
    base_userLabels() {
      return this.$store.getters['a/base/userLabels'];
    },
  },
  created() {
    this.$store.dispatch('a/base/getLabels');
  },
  mounted() {
    this.$meta.eventHub.$on('atom:star', this.base_onStarChanged);
    this.$meta.eventHub.$on('atom:labels', this.base_onLabelsChanged);
    this.$meta.eventHub.$on('atom:action', this.base_onActionChanged);
    this.$meta.eventHub.$on('atom:actions', this.base_onActionsChanged);
    this.$meta.eventHub.$on('comment:action', this.base_onCommentChanged);
    this.$meta.eventHub.$on('attachment:action', this.base_onAttachmentChanged);
  },
  beforeDestroy() {
    this.$meta.eventHub.$off('atom:star', this.base_onStarChanged);
    this.$meta.eventHub.$off('atom:labels', this.base_onLabelsChanged);
    this.$meta.eventHub.$off('atom:action', this.base_onActionChanged);
    this.$meta.eventHub.$off('atom:actions', this.base_onActionsChanged);
    this.$meta.eventHub.$off('comment:action', this.base_onCommentChanged);
    this.$meta.eventHub.$off('attachment:action', this.base_onAttachmentChanged);
  },
  methods: {
    async base_onInit() {
      // load atomClasses
      await this.$store.dispatch('a/base/getAtomClasses');
    },
    async base_loadAtomClass() {
      try {
        // check container first
        if (this.container.atomClass) {
          this.base.atomClass = this.container.atomClass;
        } else {
          this.base.atomClass = await this.$api.post('/a/base/atom/atomClass', {
            key: { atomId: this.container.atomId },
          });
        }
        this.base.atomClassBase = this.getAtomClass(this.base.atomClass);
        // module
        this.base.module = await this.$meta.module.use(this.base.atomClass.module);
        // validateParams
        const res = await this.$api.post('/a/base/atom/validator', {
          atomClass: this.base.atomClass,
        });
        this.base.validateParams = {
          module: res.module,
          validator: res.validator,
        };
        // not set: found
        // this.base.notfound = false;
        // ok
        return true;
      } catch (err) {
        this.base.notfound = true;
        return false;
      }
    },
    async base_loadItem() {
      try {
        // item
        const options = this.base_prepareReadOptions();
        this.base.item = await this.$api.post('/a/base/atom/read', {
          key: { atomId: this.container.atomId },
          atomClass: this.base.atomClass,
          options,
        });
        // actions
        await this.actions_fetchActions();
        // found
        this.base.notfound = false;
        // ok
        return true;
      } catch (err) {
        this.base.notfound = true;
        return false;
      }
    },
    base_prepareReadOptions() {
      // options
      const options = {};
      // layout
      options.layout = this.layout.current;
      // options
      return options;
    },
    base_getCurrentStage() {
      if (!this.base.item) return null;
      const stage = this.base.item.atomStage;
      if (stage === undefined) return undefined;
      return this.base_stageToString(stage);
    },
    base_stageToString(stage) {
      return stage === 0 ? 'draft' : stage === 1 ? 'formal' : 'history';
    },
    base_checkIfEventActionValid(data) {
      const key = data.key;
      const atomClass = data.atomClass;
      if (!atomClass) throw new Error('Should specify atom class');

      if (!this.base_ready) return false;
      if (
        atomClass.module !== this.base.atomClass.module ||
        atomClass.atomClassName !== this.base.atomClass.atomClassName
      ) {
        return false;
      }
      if (this.base.item.atomId !== key.atomId) return false;
      // ok
      return true;
    },
    async base_onActionChanged(data) {
      // const key = data.key;
      // const atomClass = data.atomClass;
      const action = data.action;
      if (!this.base_checkIfEventActionValid(data)) {
        return;
      }

      if (action.name === 'save' && this.container.mode === 'edit' && this.page_getDirty()) {
        if (data.actionSource === this) {
          // just update time
          if (this.base.item.atomUpdatedAt) {
            this.base.item.atomUpdatedAt = new Date();
          } else {
            this.base.item.updatedAt = new Date();
          }
        } else {
          // prompt
          const title = this.base.item.atomNameLocale || this.base.item.atomName;
          try {
            await this.$view.dialog.confirm(this.$text('DataChangedReloadConfirm'), title);
            if (this.page_getDirty()) {
              // only load once when more updates
              await this.base_loadItem();
              this.page_setDirty(false);
            }
          } catch (err) {
            // just update time
            if (this.base.item.atomUpdatedAt) {
              this.base.item.atomUpdatedAt = new Date();
            } else {
              this.base.item.updatedAt = new Date();
            }
          }
        }
        return;
      }

      // create
      if (action.name === 'create') {
        // do nothing
        return;
      }
      // not check delete for draft
      //    for: delete on atom list but not delete on atom when atomClosed=1
      // delete
      if (action.name === 'delete') {
        if (this.base.item.atomStage !== 0 || this.base.item.atomIdFormal === 0) {
          this.base.item = null;
          this.base.notfound = true;
          this.base.ready = false;
          return;
        }
      }
      // others
      await this.base_loadItem();
    },
    async base_onActionsChanged(data) {
      // const key = data.key;
      // const atomClass = data.atomClass;
      if (!this.base_checkIfEventActionValid(data)) {
        return;
      }

      await this.actions_fetchActions();
    },
    async base_onOpenDrafted(data) {
      const key = data.key;

      if (!this.base_ready) return;
      if (this.base.item.atomId !== key.atomId) return;

      await this.actions_fetchActions();
    },
    base_onCommentChanged(data) {
      if (!this.base.item || data.atomId !== this.container.atomId) return;
      if (data.action === 'create') this.base.item.commentCount += 1;
      if (data.action === 'delete') this.base.item.commentCount -= 1;
    },
    base_onAttachmentChanged(data) {
      if (!this.base.item || data.atomId !== this.container.atomId) return;
      if (data.action === 'create') this.base.item.attachmentCount += 1;
      if (data.action === 'delete') this.base.item.attachmentCount -= 1;
    },
    base_onStarChanged(data) {
      if (!this.base.item || data.key.atomId !== this.container.atomId) return;
      this.base.item.star = data.star;
    },
    base_onLabelsChanged(data) {
      if (!this.base.item || data.key.atomId !== this.container.atomId) return;
      this.base.item.labels = JSON.stringify(data.labels);
    },
  },
};
