import Vue from 'vue';
const ebPageContext = Vue.prototype.$meta.module.get('a-components').options.mixins.ebPageContext;
export default {
  mixins: [ ebPageContext ],
  data() {
    return {
      flowDefId: this.$f7route.query.flowDefId,
      type: this.$f7route.query.type,
      id: this.$f7route.query.id,
      nodeBases: null,
    };
  },
  computed: {
    ready() {
      return this.nodeBases;
    },
    diagram() {
      return this.contextParams.diagram;
    },
    data() {
      return this.contextParams.data;
    },
  },
  created() {
    this.__load();
  },
  mounted() {
    this.diagram.$on('diagram:destroy', this.onDiagramDestroy);
  },
  beforeDestroy() {
    this.diagram.$off('diagram:destroy', this.onDiagramDestroy);
  },
  methods: {
    async __load() {
      this.nodeBases = await this.$local.dispatch('getNodeBases');
    },
    onDiagramDestroy() {
      this.$view.close();
    },
    __getPageTitle() {
      return `${this.$text('Properties')}: ${this.data.nameLocale || this.data.name || this.data.id}`;
    },
  },
  render() {
    return (
      <eb-page>
        <eb-navbar title={this.__getPageTitle()} eb-back-link="Back">
        </eb-navbar>
        <f7-list>

        </f7-list>
      </eb-page>
    );
  },
};

