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
  },
  data() {
    return {};
  },
  computed: {},
  created() {
    this.init();
  },
  methods: {
    init() {},
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
