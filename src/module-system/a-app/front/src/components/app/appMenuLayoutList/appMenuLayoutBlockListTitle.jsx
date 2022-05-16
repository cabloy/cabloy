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
    return {};
  },
  created() {},
  methods: {
    _renderHome() {
      // get current
      const appItem = this.layoutManager.base.appItem;
      // if(this.layoutManager.)
    },
    _renderNavRight() {
      const children = [];
      // home
      children.push(this._renderHome);
      // dashboard

      // ok
      return <f7-nav-right>{children}</f7-nav-right>;
    },
  },
  render() {
    return this._renderNavRight();
  },
};
