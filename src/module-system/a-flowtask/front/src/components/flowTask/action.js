export default {
  meta: {
    global: false,
  },
  methods: {
    async onAction({ ctx, action, item }) {
      if (action.name === 'viewAtom') {
        console.log(action);
      }
    },
  },
};
