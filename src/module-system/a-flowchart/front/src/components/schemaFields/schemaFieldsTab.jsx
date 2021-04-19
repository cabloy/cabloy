export default {
  meta: {
    global: false,
  },
  props: {
    context: {
      type: Object,
    },
    readOnly: {
      type: Boolean,
    },
    mode: {
      type: String,
    },
    valueSchema: {
      type: Object,
    },
    schemaReference: {
      type: Object,
    },
  },
  data() {
    return {
      valueMode: 0,
      valueModes: [
        { title: 'Allow All Fields', value: 1 },
        { title: 'Disable All Fields', value: 2 },
        { title: 'Allow Specific Fields', value: 3 },
        { title: 'Custom', value: 4 },
      ],
    };
  },
  created() {
    this.__init();
  },
  methods: {
    __init() {
      // valueMode
      this.__init_valueMode();
    },
    __init_valueMode() {
      const value = this.valueSchema[this.mode];
      if (!value) {
        this.valueMode = 2;
      } else if (value === true) {
        this.valueMode === 1;
      } else if (Array.isArray(value)) {
        this.valueMode = 3;
      } else {
        this.valueMode = 4;
      }
    },
    onPerformAdd() {

    },
  },
  render() {
    return (
      <eb-list form inline-labels no-hairlines-md>
        <f7-list-group>
          <f7-list-item smartSelect title={this.$text('Mode')} smartSelectParams={ { openIn: 'sheet', closeOnSelect: true } }>
            <eb-select name="mode" vModel={this.valueMode} multiple={false} options={this.valueModes}></eb-select>
          </f7-list-item>
        </f7-list-group>
        <f7-list-group>
          <f7-list-item group-title>
            <div class="display-flex justify-content-space-between">
              <div></div>
              <eb-link iconMaterial='add' propsOnPerform={this.onPerformAdd}></eb-link>
            </div>
          </f7-list-item>
        </f7-list-group>
      </eb-list>
    );
  },
};
