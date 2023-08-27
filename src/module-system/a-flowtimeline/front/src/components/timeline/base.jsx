export default {
  data() {
    return {
      base: {
        data: null,
        notfound: false,
      },
    };
  },
  computed: {
    base_ready() {
      return this.base.ready && this.base.data;
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
            __showStatus: this.base_checkFlowNodeShowStatus(task),
          };
          groups.push(group);
        }
        group.items.push(task);
      }
      return groups;
    },
  },
  methods: {
    async base_loadData() {
      try {
        // flow data
        const flowOld = this.base_flow;
        const atomOld = this.base_atom;
        this.base.data = await this.$api.post('/a/flowtask/flow/data', {
          flowId: this.container.flowId,
        });
        if (!this.base.data) {
          this.base.notfound = true;
          return false;
        }
        const flowNew = this.base_flow;
        const atomNew = this.base_atom;
        if (atomOld && atomNew && flowOld && flowNew && flowOld.flowStatus === 0 && flowNew.flowStatus === 1) {
          if (atomOld.atomStage === 0) {
            this.base_base_loadData_checkEmitAtomEvent_draft({ atomNew, atomOld });
          } else if (atomOld.atomStage === 1) {
            this.base_base_loadData_checkEmitAtomEvent_formal({ atomNew, atomOld });
          }
        }
        // check AssigneesConfirmation
        this.base_checkOpenAssigneesConfirmation();
        // ok
        return true;
      } catch (err) {
        this.base.notfound = true;
        return false;
      }
    },
  },
};
