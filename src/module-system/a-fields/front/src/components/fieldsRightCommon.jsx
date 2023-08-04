import MixinValueMode from './fieldsRightCommon/valueMode.jsx';
import MixinValueBase from './fieldsRightCommon/valueBase.jsx';

export default {
  mixins: [MixinValueMode, MixinValueBase],
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
        {this._renderListGroupValueBase()}
      </eb-list>
    );
  },
};
