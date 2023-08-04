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
      ready: false,
      mode, // view/edit
      atomClass: {
        module,
        atomClassName,
      },
      fieldsRightSelf: null,
      schemaBase: null,
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
    this.init();
  },
  methods: {
    async init() {
      // fieldsRight
      if (this.mode === 'view') {
        this.fieldsRightSelf = this.fieldsRight || {};
      } else {
        this.fieldsRightSelf = this.$meta.util.extend({}, this.fieldsRight);
      }
      // schemaBase
      await this.loadSchemaBase();
      // ready
      this.ready = true;
    },
    async loadSchemaBase() {
      // useStore
      const useStoreSchemas = await this.$store.use('a/validation/schemas');
      const schemaBase = await useStoreSchemas.getSchemaByAtomClass({ atomClass: this.atomClass });
      if (!schemaBase) {
        throw new Error(`schema not found: ${this.atomClass.module}:${this.atomClass.atomClassName}`);
      }
      // load module
      await this.$meta.module.use(schemaBase.module);
      // ok
      this.schemaBase = schemaBase;
    },
    onPerformDone() {
      // ok
      this.contextCallback(200, this.fieldsRightSelf);
      this.$f7router.back();
    },
    onPerformHelp() {
      // navigate
      this.$view.navigate(`/a/jsoneditor/json/editor?t=${Date.now()}`, {
        target: '_self',
        context: {
          params: {
            value: this.schemaBase.schema,
            title: this.$text('ReferenceForHelp'),
            readOnly: true,
          },
        },
      });
    },
    onFieldsRightChange(fieldsRight) {
      this.fieldsRightSelf = {
        ...this.fieldsRightSelf,
        ...fieldsRight,
      };
    },
    _renderRights() {
      return (
        <FieldsRightCommon
          mode={this.mode}
          atomClass={this.atomClass}
          fieldsRight={this.fieldsRightSelf}
          onFieldsRightChange={this.onFieldsRightChange}
        ></FieldsRightCommon>
      );
    },
    _renderAll() {
      return this._renderRights();
    },
    _renderNavRight() {
      if (!this.ready) return null;
      return (
        <f7-nav-right>
          <eb-link iconF7="::done" tooltip={this.$text('Done')} propsOnPerform={this.onPerformDone}></eb-link>
          <eb-link
            iconF7="::info-circle"
            tooltip={this.$text('ReferenceForHelp')}
            propsOnPerform={this.onPerformHelp}
          ></eb-link>
        </f7-nav-right>
      );
    },
  },
  render() {
    return (
      <eb-page>
        <eb-navbar title={this.pageTitle} eb-back-link="Back">
          {this._renderNavRight()}
        </eb-navbar>
        {this._renderAll()}
      </eb-page>
    );
  },
};
