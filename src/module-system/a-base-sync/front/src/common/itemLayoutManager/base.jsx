import Vue from 'vue';
export default {
  data() {
    return {
      base: {
        ready: false,
        configAtomBase: null,
        configAtom: null,
        //
        item: null,
        atomClass: null,
        module: null,
        validateParams: null,
        actions: null,
        notfound: false,
        //
        popoverId: Vue.prototype.$meta.util.nextId('popover'),
      },
    };
  },
  computed: {
    base_ready() {
      return this.base.ready && this.atomClassesAll && this.actionsAll;
    },
    base_user() {
      return this.$store.state.auth.user.op;
    },
    base_userLabels() {
      return this.$store.getters['a/base/userLabels'];
    },
    base_showPopover() {
      if (!this.base_ready) return false;
      // submit
      const submit = this.base_findAction('write') && this.base.item.atomStage === 0;
      if (submit) return true;
      // others
      for (const action of this.base.actions) {
        if (action.name !== 'write') return true;
      }
      return false;
    },
  },
  created() {
    this.$store.dispatch('a/base/getLabels');
  },
  methods: {
    async base_loadItem() {
      try {
        // item
        const options = this.base_prepareReadOptions();
        this.base.item = await this.$api.post('/a/base/atom/read', {
          key: { atomId: this.container.atomId },
          options,
        });
        // atomClass
        this.base.atomClass = {
          id: this.base.item.atomClassId,
          module: this.base.item.module,
          atomClassName: this.base.item.atomClassName,
        };
        // module
        this.base.module = await this.$meta.module.use(this.base.item.module);
        // validateParams
        const res = await this.$api.post('/a/base/atom/validator', {
          atomClass: { id: this.base.item.atomClassId },
        });
        this.base.validateParams = {
          module: res.module,
          validator: res.validator,
        };
        // actions
        await this.base_fetchActions();
      } catch (err) {
        this.base.notfound = true;
      }
    },
    async base_fetchActions() {
      this.base.actions = await this.$api.post('/a/base/atom/actions', {
        key: { atomId: this.container.atomId },
      });
    },
    base_findAction(actionName) {
      if (!this.base.actions) return null;
      return this.base.actions.find(item => item.name === actionName);
    },
    base_onAction(event, action) {
      if (action === 'save' || action === 'submit') {
        return this.$refs.validate.perform(event, action);
      }
      if (typeof action === 'string') {
        action = {
          module: this.base.atomClass.module,
          atomClassName: this.base.atomClass.atomClassName,
          name: action,
        };
      }
      // action
      let _action = this.getAction(action);
      // for write
      if (action.name === 'write') {
        _action = this.$utils.extend({}, _action, { navigateOptions: { target: '_self' } });
      }
      return this.$meta.util.performAction({ ctx: this, action: _action, item: this.base.item }).then(res => {
        if (res) this.$f7router.back();
      });
    },
    base_prepareReadOptions() {
      // options
      const options = {
      };
      // layout
      options.layout = this.layout.current;
      // options
      return options;
    },
    base_getCurrentStage() {
      if (!this.base.item) return null;
      const stage = this.base.item.atomStage;
      return stage === 0 ? 'draft' : stage === 1 ? 'archive' : 'history';
    },
    base_renderActions() {
      if (!this.base_ready) return null;
      const children = [];
      //
      const actionWrite = this.base_findAction('write');
      if (actionWrite) {
        const actionIcon = this.container.mode === 'edit' ? 'save' : 'edit';
        const actionName = this.container.mode === 'edit' ? 'save' : 'write';
        children.push(
          <eb-link ref="buttonSave" iconMaterial={actionIcon} propsOnPerform={event => this.base_onAction(event, actionName)}></eb-link>
        );
      }
      //
      if (this.base_showPopover) {
        children.push(
          <f7-link iconMaterial="more_horiz" popover-open={`#${this.base.popoverId}`}></f7-link>
        );
      }
      //
      return children;
    },
  },
};
