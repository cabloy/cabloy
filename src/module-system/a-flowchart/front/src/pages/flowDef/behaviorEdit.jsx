import Vue from 'vue';
const ebPageContext = Vue.prototype.$meta.module.get('a-components').options.mixins.ebPageContext;
const ebPageDirty = Vue.prototype.$meta.module.get('a-components').options.mixins.ebPageDirty;
export default {
  mixins: [ebPageContext, ebPageDirty],
  data() {
    return {
      flowDefId: parseInt(this.$f7route.query.flowDefId),
      nodeId: this.$f7route.query.nodeId,
      behaviorId: this.$f7route.query.behaviorId,
      behavior: null,
      ready: false,
    };
  },
  computed: {
    context() {
      return this.contextParams.context;
    },
    readOnly() {
      return this.contextParams.readOnly;
    },
    value() {
      return this.contextParams.value;
    },
    page_title() {
      let title = this.$text('Behavior');
      if (this.behavior) {
        title = `${title}: ${this.behavior.name}`;
      }
      return this.page_getDirtyTitle(title);
    },
  },
  watch: {
    behavior: {
      handler() {
        if (!this.ready) return;
        this.page_setDirty(true);
      },
      deep: true,
    },
  },
  created() {
    this.__load();
  },
  methods: {
    __load() {
      // data
      this.behavior = this.$meta.util.extend({}, this.value);
      this.$nextTick(() => {
        this.ready = true;
      });
    },
    onPerformDone() {
      this.contextCallback(200, this.behavior);
      this.page_setDirty(false);
      this.$f7router.back();
    },
    _renderProperties() {
      if (!this.ready) return;
      // list
      return <eb-list form inline-labels no-hairlines-md></eb-list>;
    },
  },
  render() {
    let domDone;
    if (!this.readOnly) {
      domDone = <eb-link iconMaterial="done" propsOnPerform={this.onPerformDone}></eb-link>;
    }
    return (
      <eb-page>
        <eb-navbar title={this.page_title} eb-back-link="Back">
          <f7-nav-right>{domDone}</f7-nav-right>
        </eb-navbar>
        {this._renderProperties()}
      </eb-page>
    );
  },
};
