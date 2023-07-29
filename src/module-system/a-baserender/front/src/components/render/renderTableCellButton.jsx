import Vue from 'vue';
const ebRenderTableCellBase = Vue.prototype.$meta.module.get('a-base').options.mixins.ebRenderTableCellBase;

export default {
  mixins: [ebRenderTableCellBase],
  data() {
    return {};
  },
  computed: {
    button() {
      // text/onPerform: actionModule/actionComponent/actionPath/name
      return this.base_getParam({ name: 'button' });
    },
    buttons() {
      return this.base_getParam({ name: 'buttons' });
    },
  },
  methods: {
    onPerformClick(event, button) {
      event.stopPropagation();
      const { record } = this.info;
      return this.$meta.util.performAction({ ctx: this.layoutManager, action: button.onPerform, item: record });
    },
    _renderButton(button) {
      const { text, record } = this.info;
      // text
      let _text = this.$meta.util.replaceTemplate(button.text, record) || text || '';
      _text = this.base_formatText({ text: _text });
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
