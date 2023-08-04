import MixinValueMode from './fieldsRightCommon/valueMode.jsx';
import MixinValueBasicControls from './fieldsRightCommon/valueBasicControls.jsx';
import MixinValueSpecificControls from './fieldsRightCommon/valueSpecificControls.jsx';

export default {
  mixins: [MixinValueMode, MixinValueBasicControls, MixinValueSpecificControls],
  props: {
    mode: {
      type: String,
    },
    atomClass: {
      type: Object,
    },
    fieldsRight: {
      type: Object,
    },
    schemaBase: {
      type: Object,
    },
  },
  data() {
    return {};
  },
  methods: {
    __getPropertyTitle({ property }) {
      if (!property.ebTitle) return null;
      let title = this.$text(property.ebTitle);
      if (property.ebType === 'group-flatten' || property.ebType === 'group') {
        title = `====== ${this.$text('FieldsRightPropertyGroup')}: ${title}`;
      }
      return title;
    },
  },
  render() {
    return (
      <eb-list form inline-labels no-hairlines-md>
        {this._renderListGroupValueMode()}
        {this._renderListGroupValueBasicControls()}
        {this._renderListGroupValueSpecificControls()}
      </eb-list>
    );
  },
};
