export default {
  props: {
    flowLayoutManager: {
      type: Object,
    },
    flowTaskId: {
      type: Number,
    },
  },
  data() {
    return {
    };
  },
  render() {
    return (
      <f7-sheet ref="sheet" opened fill>
        <f7-toolbar>
          <div class="left">
          </div>
          <div class="right">
            <eb-link ref="buttonSubmit" propsOnPerform={event => this.onSubmit(event)}>{this.$text('Submit')}</eb-link>
          </div>
        </f7-toolbar>
        <f7-page-content>
          <div class="label">
            <f7-badge style={ { backgroundColor: this.labelColor } }>{this.labelText}</f7-badge>
          </div>

        </f7-page-content>
      </f7-sheet>
    );
  },
};
