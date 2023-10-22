export default {
  methods: {
    renderRoot() {
      if (!this.validate.ready) return <div></div>;
      // context
      const context = {
        parcel: this.getParcel(),
      };
      // renderProperties
      const children = this.renderProperties(context);
      const props = {
        form: true,
        noHairlinesMd: true,
        inlineLabels: !this.$config.form.floatingLabel,
      };
      return (
        <eb-list class="eb-list-container" {...{ props }} onSubmit={this.onSubmit}>
          {children}
        </eb-list>
      );
    },
  },
};
