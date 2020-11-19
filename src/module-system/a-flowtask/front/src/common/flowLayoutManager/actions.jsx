import actionCancelFlow from '../../components/actionCancelFlow.jsx';
export default {
  components: {
    actionCancelFlow,
  },
  data() {
    return {
    };
  },
  methods: {
    actions_renderActionComponents() {
      return (
        <actionCancelFlow ref="actionCancelFlow"></actionCancelFlow>
      );
    },
  },
};
