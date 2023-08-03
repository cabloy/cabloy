import Vue from 'vue';
import FieldsRightCommon from '../components/fieldsRightCommon.jsx';
const ebPageContext = Vue.prototype.$meta.module.get('a-components').options.mixins.ebPageContext;
export default {
  mixins: [ebPageContext],
  components: {
    FieldsRightCommon,
  },
  data() {
    const mode = this.$f7route.query.mode;
    const module = this.$f7route.query.module;
    const atomClassName = this.$f7route.query.atomClassName;
    return {
      mode, // view/edit
      atomClass: {
        module,
        atomClassName,
      },
      fieldsRightSelf: null,
    };
  },
  computed: {
    pageTitle() {
      return this.$text('FieldsRight');
    },
    fieldsRight() {
      return this.contextParams.fieldsRight;
    },
  },
  created() {
    this.fieldsRightSelf = this.mode === 'view' ? this.fieldsRight : this.$meta.util.extend({}, this.fieldsRight);
  },
  methods: {
    onPerformDone() {
      // ok
      this.contextCallback(200, this.fieldsRightSelf);
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
      return (
        <FieldsRightCommon
          mode={this.mode}
          atomClass={this.atomClass}
          fieldsRight={this.fieldsRightSelf}
        ></FieldsRightCommon>
      );
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
