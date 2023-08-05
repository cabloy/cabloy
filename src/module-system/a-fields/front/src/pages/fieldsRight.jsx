import Vue from 'vue';
import FieldsRightCommon from '../components/fieldsRightCommon.jsx';
const ebPageContext = Vue.prototype.$meta.module.get('a-components').options.mixins.ebPageContext;
const ebPageDirty = Vue.prototype.$meta.module.get('a-components').options.mixins.ebPageDirty;
export default {
  mixins: [ebPageContext, ebPageDirty],
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
      schemaBases: {},
      atomClassBase: null,
      atomClassDetails: null,
    };
  },
  computed: {
    pageTitle() {
      return this.page_getDirtyTitle(this.$text('FieldsRight'));
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
      // schemaBases
      await this.loadAllSchemaBases();
      // ready
      this.ready = true;
    },
    async loadAllSchemaBases() {
      // main
      await this.loadSchemaBase({ atomClass: this.atomClass });
      // details
      const useStoreAtomClasses = await this.$store.use('a/basestore/atomClasses');
      this.atomClassBase = await useStoreAtomClasses.getAtomClassBase({ atomClass: this.atomClass });
      this.atomClassDetails = this.atomClassBase.details;
      if (!this.atomClassDetails) return;
      for (const atomClassDetail of this.atomClassDetails) {
        await this.loadSchemaBase({ atomClass: atomClassDetail });
      }
    },
    async loadSchemaBase({ atomClass }) {
      // atomClass key
      const atomClassKey = this._getAtomClassKey({ atomClass });
      // useStore
      const useStoreSchemas = await this.$store.use('a/validation/schemas');
      const schemaBase = await useStoreSchemas.getSchemaByAtomClass({ atomClass });
      if (!schemaBase) {
        throw new Error(`schema not found: ${atomClassKey}`);
      }
      // load module
      await this.$meta.module.use(schemaBase.module);
      // ok
      this.schemaBases[atomClassKey] = schemaBase;
    },
    _getAtomClassKey({ atomClass }) {
      return `${atomClass.module}:${atomClass.atomClassName}`;
    },
    onPerformDone() {
      // ok
      this.contextCallback(200, this.fieldsRightSelf);
      this.page_setDirty(false);
      this.$f7router.back();
    },
    onPerformHelp({ atomClass }) {
      // atomClass key
      const atomClassKey = this._getAtomClassKey({ atomClass });
      const schemaBase = this.schemaBases[atomClassKey];
      // navigate
      this.$view.navigate(`/a/jsoneditor/json/editor?t=${Date.now()}`, {
        target: '_self',
        context: {
          params: {
            value: schemaBase.schema,
            title: this.$text('ReferenceForHelp'),
            readOnly: true,
          },
        },
      });
    },
    onFieldsRightChange() {
      this.page_setDirty(true);
    },
    _renderRights({ main, atomClass }) {
      // atomClass key
      const atomClassKey = this._getAtomClassKey({ atomClass });
      const schemaBase = this.schemaBases[atomClassKey];
      let fieldsRight;
      if (main) {
        fieldsRight = this.fieldsRightSelf;
      } else {
        const details = this.fieldsRightSelf.details || {};
        fieldsRight = details[atomClassKey] || {};
      }
      return (
        <FieldsRightCommon
          mode={this.mode}
          atomClass={atomClass}
          fieldsRight={fieldsRight}
          schemaBase={schemaBase}
          onFieldsRightChange={this.onFieldsRightChange}
        ></FieldsRightCommon>
      );
    },
    _renderAll() {
      if (!this.ready) return null;
      return this._renderRights({ main: true, atomClass: this.atomClass });
    },
    _renderButtonHelp({ atomClass }) {
      return (
        <eb-link
          iconF7="::info-circle"
          tooltip={this.$text('ReferenceForHelp')}
          propsOnPerform={() => this.onPerformHelp({ atomClass })}
        ></eb-link>
      );
    },
    _renderNavRight() {
      if (!this.ready) return null;
      let domHelp;
      if (!this.atomClassDetails) {
        domHelp = this._renderButtonHelp({ atomClass: this.atomClass });
      }
      return (
        <f7-nav-right>
          <eb-link iconF7="::done" tooltip={this.$text('Done')} propsOnPerform={this.onPerformDone}></eb-link>
          {domHelp}
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
