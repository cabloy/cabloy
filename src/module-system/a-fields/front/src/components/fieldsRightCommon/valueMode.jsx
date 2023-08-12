export default {
  data() {
    return {
      valueModes: null,
    };
  },
  computed: {
    valueMode() {
      return this.fieldsRight.mode || 'allowAllFieldsRead';
    },
  },
  created() {
    const useStoreFieldsRightMode = this.$store.useSync('a/fields/fieldsRightMode');
    this.valueModes = useStoreFieldsRightMode.getModes();
  },
  methods: {
    onInputValueMode(valueMode) {
      this.$set(this.fieldsRight, 'mode', valueMode);
      this.$emit('fieldsRightChange');
    },
    _renderListGroupValueMode() {
      return (
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
              onInput={this.onInputValueMode}
              multiple={false}
              options={this.valueModes}
            ></eb-select>
          </f7-list-item>
        </f7-list-group>
      );
    },
  },
};
