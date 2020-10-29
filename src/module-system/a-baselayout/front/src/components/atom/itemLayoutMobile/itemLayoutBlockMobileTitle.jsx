export default {
  meta: {
    global: false,
  },
  props: {
    layoutManager: {
      type: Object,
    },
    blockConfig: {
      type: Object,
    },
  },
  data() {
    return {
    };
  },
  created() {
  },
  methods: {
  },
  render() {
    return (
      <f7-nav-right>
        {this.layoutManager.actions_render()}
      </f7-nav-right>
    );
  },
};
