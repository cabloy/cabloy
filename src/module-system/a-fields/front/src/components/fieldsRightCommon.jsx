export default {
  props: {
    mode: {
      type: String,
    },
    atomClass: {
      type: Object,
    },
    fieldsRight: {
      type: Object,
    },
  },
  data() {
    return {
      ready: false,
      schemaBase: null,
    };
  },
  created() {
    this.init();
  },
  methods: {
    async init() {
      await this.loadSchemaBase();
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
  },
  render() {
    return (
      <eb-list form inline-labels no-hairlines-md>
        <f7-list-group>
          <f7-list-item
            smartSelect={!this.readOnly}
            title={this.$text('Mode')}
            smartSelectParams={{ openIn: 'sheet', closeOnSelect: true }}
          >
            <eb-select
              readOnly={this.readOnly}
              name="mode"
              value={this.valueMode}
              onInput={this.onInputMode}
              multiple={false}
              options={this.valueModes}
            ></eb-select>
          </f7-list-item>
        </f7-list-group>
      </eb-list>
    );
  },
};
