export default {
  props: {
    dict: {},
  },
  data() {
    return {
      codesMatched: [],
    };
  },

  methods: {
    search(query) {
      if (query) {
        this.$refs.sheet.f7Sheet.open();
      } else {
        this.$refs.sheet.f7Sheet.close();
      }
    },
    _renderEmpty() {
      return <div>{this.$text('NoMatchedData')}</div>;
    },
    _renderList() {
      return (
        <eb-list form inline-labels no-hairlines-md>
          <eb-list-input
            label={this.$text('Remark')}
            type="text"
            clear-button
            placeholder={this.$text('Remark')}
            v-model={this.remark}
          ></eb-list-input>
        </eb-list>
      );
    },
  },
  render() {
    const domContent = this.codesMatched.length > 0 ? this._renderList() : this._renderEmpty();
    return (
      <f7-sheet ref="sheet" backdrop={false} fill>
        <f7-page-content>{domContent}</f7-page-content>
      </f7-sheet>
    );
  },
};
