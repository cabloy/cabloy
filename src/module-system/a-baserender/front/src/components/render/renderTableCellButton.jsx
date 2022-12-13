import Vue from 'vue';
const ebRenderTableCellFormat = Vue.prototype.$meta.module.get('a-base').options.mixins.ebRenderTableCellFormat;

export default {
  meta: {
    global: false,
  },
  mixins: [ebRenderTableCellFormat],
  props: {
    layoutManager: {
      type: Object,
    },
    layout: {
      type: Object,
    },
    layoutItems: {
      type: Object,
    },
    info: {
      type: Object,
    },
    button: {
      type: Object, // text/onPerform: actionModule/actionComponent/actionPath/name
    },
    buttons: {
      type: Array,
    },
  },
  data() {
    return {};
  },
  methods: {
    onPerformClick(event, button) {
      const { record } = this.info;
      return this.$meta.util.performAction({ ctx: this.layoutManager, action: button.onPerform, item: record });
    },
    _renderButton(button) {
      const { text, record, column } = this.info;
      // text
      let _text = this.$meta.util.replaceTemplate(button.text, record) || text || '';
      _text = this.formatText({ text: _text, column });
      // props
      const props = Object.assign({}, button.props);
      // render
      return (
        <eb-button key={_text} {...{ props }} propsOnPerform={event => this.onPerformClick(event, button)}>
          {_text}
        </eb-button>
      );
    },
    _renderButtons(buttons) {
      const children = [];
      for (const button of buttons) {
        const domButton = this._renderButton(button);
        children.push(<f7-col key={domButton.key}>{domButton}</f7-col>);
      }
      return <f7-row>{children}</f7-row>;
    },
  },
  render() {
    if (!this.button && !this.buttons) {
      return <div></div>;
    }
    if (this.button) {
      return <div class="eb-antdv-table-cell eb-antdv-table-cell-button">{this._renderButton(this.button)}</div>;
    }
    return <div class="eb-antdv-table-cell eb-antdv-table-cell-buttons">{this._renderButtons(this.buttons)}</div>;
  },
};
