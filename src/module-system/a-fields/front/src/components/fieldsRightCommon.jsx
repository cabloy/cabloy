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
      valueModes: [
        { title: 'AllowAllFieldsRead', value: 'allowAllFieldsRead' },
        { title: 'AllowAllFieldsReadWrite', value: 'allowAllFieldsReadWrite' },
        { title: 'AllowSpecificFields', value: 'allowSpecificFields' },
        { title: 'Custom', value: 'custom' },
      ],
    };
  },
  computed: {
    valueMode() {
      return this.fieldsRight.mode || 'allowAllFieldsRead';
    },
  },
  created() {
    this.init();
  },
  methods: {
    init() {},
    onInputMode(valueMode) {
      console.log(valueMode);
    },
  },
  render() {
    return (
      <eb-list form inline-labels no-hairlines-md>
        <f7-list-group>
          <f7-list-item
            class="eb-list-group-title"
            smartSelect={this.mode === 'edit'}
            title={this.$text('Mode')}
            smartSelectParams={{ openIn: 'sheet', closeOnSelect: true }}
          >
            <eb-select
              readOnly={this.mode !== 'edit'}
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
