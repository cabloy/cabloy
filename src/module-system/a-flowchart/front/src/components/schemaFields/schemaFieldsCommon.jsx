export default {
  props: {
    context: {
      type: Object,
    },
    readOnly: {
      type: Boolean,
    },
    valueSchema: {
      type: Object,
    },
    schemaReference: {
      type: Object,
    },
  },
  data() {
    return {};
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
