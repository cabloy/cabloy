export default {
  methods: {
    renderButton(context) {
      const { key, property } = context;
      const title = this.getTitle(context, true);
      // button/buttons
      const button = property.ebParams.button;
      const buttons = property.ebParams.buttons;
      let children;
      let className;
      if (!button && !buttons) {
        children = null;
        className = '';
      } else if (button) {
        children = this._renderButton_button(property, button);
        className = 'eb-list-item-render-button';
      } else if (buttons) {
        children = this._renderButton_buttons(property, buttons);
        className = 'eb-list-item-render-buttons';
      }
      return (
        <f7-list-item key={key} class={className} title={title}>
          <div slot="after" class="buttons">
            {children}
          </div>
        </f7-list-item>
      );
    },
    _renderButton_onPerform(event, button) {
      return this.$meta.util.performAction({
        ctx: this,
        action: button.onPerform,
        item: { context },
      });
    },
    _renderButton_button(property, button) {
      // text
      // not use parcel.data
      let _text = this.$meta.util.replaceTemplate(button.text, this.parcel.data) || '';
      _text = this._formatTextGeneral(property, _text);
      // props
      const props = Object.assign({}, button.props);
      // render
      return (
        <eb-button key={_text} {...{ props }} propsOnPerform={event => this._renderButton_onPerform(event, button)}>
          {_text}
        </eb-button>
      );
    },
    _renderButton_buttons(property, buttons) {
      const children = [];
      for (const button of buttons) {
        children.push(this._renderButton_button(property, button));
      }
      return children;
    },
  },
};
