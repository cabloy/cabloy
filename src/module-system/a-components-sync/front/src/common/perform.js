function trimMessage(ctx, message) {
  if (!message || typeof message !== 'string') return message;
  const locale = ctx.$meta.util.cookies.get('locale') || 'en-us';
  const maxLength = ctx.$config.error.message.maxLength[locale] || ctx.$config.error.message.maxLength.default;
  if (message.length >= maxLength) return `${message.substr(0, maxLength)}...`;
  return message;
}

export default {
  props: {
    onPerform: {
      type: Function,
    },
    context: {
    },
  },
  data() {
    return {
      _preloader: null,
    };
  },
  methods: {
    onClick(event) {
      // link
      const $clickedLinkEl = this.getLinkEl && this.getLinkEl();
      const isLink = $clickedLinkEl && $clickedLinkEl.length > 0;

      // only preventDefault for link
      if (isLink) {
        event && event.preventDefault();
      }

      // Prevent Router
      if (event && event.preventF7Router) return;
      if ($clickedLinkEl &&
        ($clickedLinkEl.hasClass('prevent-router') || $clickedLinkEl.hasClass('router-prevent'))
      ) return;

      // only once
      if (this._preloader) return;

      // emit click
      this.$emit('click', event);

      // check again !!!
      if (event && event.preventF7Router) return;

      // linkClick
      if (!this.onPerform) return this.onLinkClick && this.onLinkClick(event);

      // onPerform
      try {
        const res = this.onPerform(event, this.context);
        if (this.$meta.util.isPromise(res)) {
          this._showPreloader();
          res.then(res2 => {
            this._hidePreloader();
            this._handleResult(res2);
          }).catch(err => {
            this._hidePreloader();
            if (err && err.code !== 401 && err.message) {
              this.$view.toast.show({ text: trimMessage(this, err.message) });
            }
          });
        } else {
          this._handleResult(res);
        }
      } catch (err) {
        console.error(err);
        this.$view.toast.show({ text: err.message });
      }

    },
    _handleResult(res) {
      if (res === true) {
        this.$view.toast.show({ text: this.$text('Operation succeeded') });
      } else if (typeof res === 'string') {
        this.$view.toast.show({ text: res });
      }
    },
    _showPreloader() {
      const html = `
        <div class="button-backdrop">
          <div class="preloader">
            <span class="preloader-inner">
              <span class="preloader-inner-gap"></span>
              <span class="preloader-inner-left">
                <span class="preloader-inner-half-circle"></span>
              </span>
              <span class="preloader-inner-right">
                <span class="preloader-inner-half-circle"></span>
              </span>
            </span>
          </div>
        </div>
      `;
      this._preloader = this.$$(html);
      this.$$(this.$el).append(this._preloader);
      this._preloader.addClass('not-animated').addClass('backdrop-in');
    },
    _hidePreloader() {
      if (this._preloader) {
        this._preloader.remove();
        this._preloader = null;
      }
    },
  },
};
