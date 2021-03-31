export default {
  meta: {
    global: false,
  },
  props: {
    readOnly: {
      type: Boolean,
    },
    contentProcess: {
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
    reload() {
      console.log('-----reload');
    },
  },
  render() {
    return (
      <div>test</div>
    );
  },
};
