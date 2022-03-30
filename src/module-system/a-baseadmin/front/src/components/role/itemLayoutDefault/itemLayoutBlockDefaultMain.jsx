export default {
  meta: {
    global: false,
  },
  props: {
    layoutManager: {
      type: Object,
    },
    layout: {
      type: Object,
    },
    blockConfig: {
      type: Object,
    },
  },
  data() {
    return {};
  },
  methods: {
    _renderToolbar() {
      return (
        <f7-segmented tag="p">
          <f7-button class="display-flex" outline iconF7="::add">
            {this.$text('Add Role')}
          </f7-button>
          <f7-button class="display-flex" outline iconF7="::group">
            {this.$text('Users')}
          </f7-button>
          <f7-button class="display-flex" outline iconF7=":role:role">
            {this.$text('Includes')}
          </f7-button>
        </f7-segmented>
      );
    },
  },
  render() {
    const domToolbar = this._renderToolbar();
    const domValidate = this.layoutManager.validate_render();
    if (!domToolbar) return domValidate;
    return (
      <div>
        {domToolbar}
        {domValidate}
      </div>
    );
  },
};
