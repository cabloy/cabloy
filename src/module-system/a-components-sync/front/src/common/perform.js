import trimMessage from './trimMessage.js';

export default {
  props: {
    onPerform: {
      type: Function,
    },
    context: {},
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
      //  not check isLink
      if ((this.link || (this.link === undefined && isLink)) && event) {
        event.preventDefault();
        event.stopPropagation();
      }

      // Prevent Router
      if (event && event.preventF7Router) return;
      if ($clickedLinkEl && ($clickedLinkEl.hasClass('prevent-router') || $clickedLinkEl.hasClass('router-prevent'))) {
        return;
      }

      // only once
      if (this._preloader) return;

      // emit click
      this.$emit('click', event);

      // check again !!!
      if (event && event.preventF7Router) return;

      // onPerform
      this._onPerformInner(event);
    },
    async _onPerformInner(event) {
      // linkClick
      if (!this.onPerform) {
        if (this.onLinkClick) {
          this.onLinkClick(event);
        }
        return;
      }
      // onPerform
      try {
        this._showPreloader();
        const res = await this.onPerform(event, this.context);
        this._hidePreloader();
        this._handleResult(res);
      } catch (err) {
        this._hidePreloader();
        if (err && (err.code === 422 || err.code === -422)) {
          const message = this.$text('Data Validation Error');
          this.$viewAppMethods.toast.show({ text: message });
          return;
        }
        if (err && err.code !== 401 && err.message) {
          this.$viewAppMethods.toast.show({ text: trimMessage(this, err.message) });
        }
        if (err && err.message) {
          throw err;
        }
      }
    },
    _handleResult(res) {
      if (res === true) {
        this.$viewAppMethods.toast.show({ text: this.$text('Operation Succeeded') });
      } else if (typeof res === 'string') {
        this.$viewAppMethods.toast.show({ text: res });
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
