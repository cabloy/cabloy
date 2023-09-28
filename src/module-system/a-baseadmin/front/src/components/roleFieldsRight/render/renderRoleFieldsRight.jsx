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
    readOnly() {
      const { property, validate } = this.context;
      return validate.readOnly || property.ebReadOnly;
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
    async onPerformViewEdit() {
      if (!this.atomClass) return;
      // queries
      const queries = {
        mode: this.readOnly ? 'view' : 'edit',
        module: this.atomClass.module,
        atomClassName: this.atomClass.atomClassName,
      };
      // url
      const url = this.$meta.util.combineQueries('/a/fields/fieldsRight', queries);
      this.$view.navigate(url, {
        target: '_self',
        context: {
          params: {
            fieldsRight: this.value ? JSON.parse(this.value) : this.value,
          },
          callback: (code, data) => {
            if (code === 200) {
              const value = data ? JSON.stringify(data, null, 2) : null;
              this.context.setValue(value);
            }
          },
        },
      });
    },
    _renderRoleFieldsRight_title() {
      const buttonTitle = this.readOnly ? 'View' : 'Edit';
      let domAfter;
      if (this.atomClass) {
        domAfter = (
          <div slot="after">
            <eb-button propsOnPerform={this.onPerformViewEdit}>{this.$text(buttonTitle)}</eb-button>
          </div>
        );
      }
      return (
        <f7-list-item class="eb-list-group-title" title={this.$text('FieldsRight')}>
          {domAfter}
        </f7-list-item>
      );
    },
    _renderRoleFieldsRight_jsonEditor() {
      if (!this.jsonEditorReady) return null;
      return (
        <eb-json-editor
          ref="jsonEditor"
          readOnly={this.readOnly}
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
    //         roleTypes: [0, 1, 2, 3, 4], // not include roleType: collaboration
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
    const domRoleFieldsRight_title = this._renderRoleFieldsRight_title();
    const domRoleFieldsRight_jsonEditor = this._renderRoleFieldsRight_jsonEditor();
    return (
      <div>
        {domRoleFieldsRight_title}
        {domRoleFieldsRight_jsonEditor}
      </div>
    );
  },
};
