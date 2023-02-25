export default {
  methods: {
    renderButton(context) {
      const { key, property } = context;
      // button/buttons
      const button = property.ebParams.button;
      const buttons = property.ebParams.buttons;
      let children;
      let className;
      let classNameAfter;
      if (!button && !buttons) {
        children = null;
        className = '';
        classNameAfter = '';
      } else if (button) {
        children = this._renderButton_button(context, property, button);
        className = 'eb-list-item-render-button';
        classNameAfter = 'button-wrapper';
      } else if (buttons) {
        children = this._renderButton_buttons(context, property, buttons);
        className = 'eb-list-item-render-buttons';
        classNameAfter = 'buttons-wrapper';
      }
      return (
        <f7-list-item key={key} class={className}>
          {context.renderTitle({ slot: 'title', notHint: true })}
          <div slot="after" class={classNameAfter}>
            {children}
          </div>
        </f7-list-item>
      );
    },
    _renderButton_onPerform(event, context, button) {
      return this.$meta.util.performAction({
        ctx: this,
        action: button.onPerform,
        item: { context },
      });
    },
    _renderButton_button(context, property, button) {
      // text
      // not use parcel.data
      let _text = this.$meta.util.replaceTemplate(button.text, this.parcel.data) || '';
      _text = this._formatTextGeneral(property, _text);
      // props
      const props = Object.assign({}, button.props);
      // render
      return (
        <eb-button
          key={_text}
          {...{ props }}
          propsOnPerform={event => this._renderButton_onPerform(event, context, button)}
        >
          {_text}
        </eb-button>
      );
    },
    _renderButton_buttons(context, property, buttons) {
      const children = [];
      for (const button of buttons) {
        children.push(this._renderButton_button(context, property, button));
      }
      return children;
    },
  },
};
