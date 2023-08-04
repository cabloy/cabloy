import MixinValueMode from './fieldsRightCommon/valueMode.jsx';

export default {
  mixins: [MixinValueMode],
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
        {this._renderListItemMode()}
      </eb-list>
    );
  },
};
