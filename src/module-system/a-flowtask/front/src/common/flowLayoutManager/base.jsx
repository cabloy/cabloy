export default {
  data() {
    return {
      base: {
        ready: false,
        configFlowBase: null,
        configAtom: null,
        config: null,
        layoutConfig: null,
        //
        data: null,
        notfound: false,
      },
    };
  },
  computed: {
    base_ready() {
      return this.base.ready && this.base.data;
    },
    base_user() {
      return this.$store.state.auth.user.op;
    },
    base_flow() {
      return this.base.data && this.base.data.flow;
    },
    base_atom() {
      return this.base.data && this.base.data.atom;
    },
    base_tasks() {
      return this.base.data && this.base.data.tasks;
    },
    base_flowOld() {
      if (!this.base_ready) return false;
      const atom = this.base_atom;
      const flow = this.base_flow;
      return !atom || atom.atomFlowId !== flow.flowId;
    },
    base_atomClass() {
      if (!this.base.data || !this.base.data.atom) return null;
      return {
        module: this.base.data.atom.module,
        atomClassName: this.base.data.atom.atomClassName,
      };
    },
    base_tasksGroup() {
      const tasks = this.base_tasks;
      if (!tasks) return null;
      const groups = [];
      let group = null;
      for (const task of tasks) {
        // node as group
        if (!group || group.flowNodeId !== task.flowNodeId) {
          group = {
            ...task,
            items: [],
          };
          groups.push(group);
        }
        group.items.push(task);
      }
      return groups;
    },
  },
  created() {},
  mounted() {
    this.$meta.eventHub.$on('comment:action', this.base_onCommentChanged);
    this.$meta.eventHub.$on('attachment:action', this.base_onAttachmentChanged);
  },
  beforeDestroy() {
    this.$meta.eventHub.$off('comment:action', this.base_onCommentChanged);
    this.$meta.eventHub.$off('attachment:action', this.base_onAttachmentChanged);
  },
  methods: {
    async base_init() {
      // layoutConfig
      this.base.layoutConfig = await this.$store.dispatch('a/base/getLayoutConfig', 'a-basefront');
    },
    base_getLayoutConfigKeyCurrent() {
      const atomClass = this.base_atomClass;
      const atomClassKey = atomClass ? `${atomClass.module}_${atomClass.atomClassName}` : null;
      const containerMode = 'view';
      return `flow.${atomClassKey}.render.item.layout.current.${containerMode}.${this.$view.size}`;
    },
    async base_loadData() {
      try {
        // flow data
        const flowOld = this.base_flow;
        this.base.data = await this.$api.post('/a/flowtask/flow/data', {
          flowId: this.container.flowId,
        });
        if (!this.base.data) {
          this.base.notfound = true;
          return false;
        }
        const flowNew = this.base_flow;
        const atomNew = this.base_atom;
        if (atomNew && flowOld && flowNew && flowOld.flowStatus === 0 && flowNew.flowStatus === 1) {
          // delete draft
          this.$meta.eventHub.$emit('atom:action', { key: { atomId: atomNew.atomId }, action: { name: 'delete' } });
          // update formal
          this.$meta.eventHub.$emit('atom:action', { key: { atomId: atomNew.atomIdFormal }, action: { name: 'save' } });
        }
        // ok
        return true;
      } catch (err) {
        this.base.notfound = true;
        return false;
      }
    },
    base_getCurrentStage() {
      if (!this.base.item) return null;
      const stage = this.base.item.atomStage;
      return stage === 0 ? 'draft' : stage === 1 ? 'formal' : 'history';
    },
    base_onCommentChanged(data) {
      const atom = this.base_atom;
      if (!atom || data.atomId !== atom.atomId) return;
      if (data.action === 'create') atom.commentCount += 1;
      if (data.action === 'delete') atom.commentCount -= 1;
    },
    base_onAttachmentChanged(data) {
      const atom = this.base_atom;
      if (!atom || data.atomId !== atom.atomId) return;
      if (data.action === 'create') atom.attachmentCount += 1;
      if (data.action === 'delete') atom.attachmentCount -= 1;
    },
  },
};
