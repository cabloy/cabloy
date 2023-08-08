export default {
  props: {
    context: {
      type: Object,
    },
  },
  data() {
    return {
      atomClass: null,
      atomClassBase: null,
      jsonEditorReady: false,
    };
  },
  computed: {
    ready() {
      return this.atomClass && this.atomClassBase;
    },
    atomMain() {
      const { validate } = this.context;
      return validate.host.atomMain;
    },
    atomClassIdTarget() {
      return this.context.getValue('atomClassIdTarget');
    },
    value() {
      return this.context.getValue();
    },
  },
  watch: {
    atomClassIdTarget: {
      handler(newValue) {
        this.__loadAtomClass(newValue);
      },
      immediate: false, // true,
    },
  },
  created() {
    this.init();
  },
  methods: {
    async init() {
      // json editor
      await this.$meta.module.use('a-jsoneditor');
      this.jsonEditorReady = true;
      // atomClass
      await this.__loadAtomClass();
    },
    async __loadAtomClass() {
      // clear
      this.atomClassBase = null;
      this.atomClass = null;
      // check
      if (!this.atomClassIdTarget) {
        return;
      }
      // atomClassBase
      const useStoreAtomClasses = await this.$store.use('a/basestore/atomClasses');
      this.atomClassBase = await useStoreAtomClasses.getAtomClassBase({
        atomClass: { id: this.atomClassIdTarget },
      });
      this.atomClass = {
        module: this.atomClassBase.module,
        atomClassName: this.atomClassBase.atomClassName,
      };
    },
    async onInputValue(value) {
      this.context.setValue(value);
    },
    _renderRoleFieldsRight() {
      if (!this.jsonEditorReady) return null;
      const { property, validate } = this.context;
      return (
        <eb-json-editor
          ref="jsonEditor"
          readOnly={validate.readOnly || property.ebReadOnly}
          valueType="string"
          value={this.value}
          changeDelay={true}
          onInput={this.onInputValue}
        ></eb-json-editor>
      );
    },
    // onSelectRoleScopes() {
    //   this.$view.navigate('/a/baseadmin/role/select', {
    //     target: '_self',
    //     context: {
    //       params: {
    //         roleIdStart: null,
    //         multiple: true,
    //         roleTypes: [0, 1, 2, 3, 4], // not include roleType: business
    //       },
    //       callback: (code, roles) => {
    //         if (code === 200) {
    //           this.context.setValue(roles, 'scopeRoles');
    //           const roleIds = roles.map(item => item.itemId);
    //           this.context.setValue(roleIds);
    //         }
    //       },
    //     },
    //   });
    // },
  },
  render() {
    const domRoleFieldsRight = this._renderRoleFieldsRight();
    return (
      <div>
        <eb-list-item title={this.$text('FieldsRight')} group-title></eb-list-item>
        {domRoleFieldsRight}
      </div>
    );
  },
};
