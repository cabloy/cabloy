import Vue from 'vue';
import SchemaFieldsCommon from '../../components/schemaFields/schemaFieldsCommon.jsx';
const ebPageContext = Vue.prototype.$meta.module.get('a-components').options.mixins.ebPageContext;
export default {
  mixins: [ebPageContext],
  components: {
    SchemaFieldsCommon,
  },
  data() {
    return {
      flowDefId: parseInt(this.$f7route.query.flowDefId),
      nodeId: this.$f7route.query.nodeId,
      valueSchema: null,
    };
  },
  computed: {
    pageTitle() {
      return this.$text('FieldRights');
    },
    context() {
      return this.contextParams.context;
    },
    readOnly() {
      return this.contextParams.readOnly;
    },
    value() {
      return this.contextParams.value;
    },
    schemaReference() {
      return this.contextParams.schemaReference;
    },
  },
  created() {
    this.valueSchema = this.value;
  },
  methods: {
    onPerformDone() {
      // ok
      this.contextCallback(200, this.valueSchema);
      this.$f7router.back();
    },
    onPerformInfo() {
      // navigate
      this.$view.navigate(`/a/jsoneditor/json/editor?t=${Date.now()}`, {
        target: '_self',
        context: {
          params: {
            value: this.schemaReference.schema,
            title: this.$text('ReferenceForHelp'),
            readOnly: true,
          },
        },
      });
    },
    _renderRights() {
      return <div>ddd</div>;
    },
    _renderAll() {
      return this._renderRights();
    },
  },
  render() {
    return (
      <eb-page>
        <eb-navbar title={this.pageTitle} eb-back-link="Back"></eb-navbar>
        {this._renderAll()}
      </eb-page>
    );
  },
};
