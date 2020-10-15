import Vue from 'vue';
const ebAtomClasses = Vue.prototype.$meta.module.get('a-base').options.mixins.ebAtomClasses;
export default {
  meta: {
    global: false,
  },
  mixins: [ ebAtomClasses ],
  props: {
    layoutManager: {
      type: Object,
    },
    layoutConfig: {
      type: Object,
    },
  },
  data() {
    return {
    };
  },
  created() {
  },
  methods: {
    getPageTitle() {
      const atomClass = this.getAtomClass(this.layoutManager.atomClass);
      if (!atomClass) return this.$text('Atom');
      return `${this.$text('Atom')}: ${atomClass.titleLocale}`;
    },
    _renderBlockTitle() {
      if (!this.layoutConfig.blocks.title) return null;
      return (
        <eb-navbar title={this.getPageTitle()} eb-back-link="Back">
        </eb-navbar>
      );
    },
  },
  render() {
    return (
      <div>
        {this._renderBlockTitle()}
      </div>
    );
  },
};

