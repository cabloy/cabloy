import actionCancelFlow from '../../components/action/actionCancelFlow.jsx';
import actionHandleTask from '../../components/action/actionHandleTask.jsx';

export default {
  components: {
    actionCancelFlow,
    actionHandleTask,
  },
  data() {
    return {
    };
  },
  methods: {
    actions_renderActionComponents() {
      const children = [];
      children.push(
        <actionCancelFlow key="actionCancelFlow" ref="actionCancelFlow"></actionCancelFlow>
      );
      children.push(
        <actionHandleTask key="actionHandleTask" ref="actionHandleTask"></actionHandleTask>
      );
      return children;
    },
  },
};
