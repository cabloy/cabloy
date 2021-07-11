export default {
  props: {
    name: {
      type: String,
      default: 'cat',
    },
  },
  data() {
    return {
      counter: 1,
    };
  },
  created() {
    console.log(this.name);
  },
  beforeDestroy() {},
  methods: {
    addCounter() {
      this.counter++;
    },
    showCounter() {
      return <div>Counter: {this.counter}</div>;
    },
    renderContent() {
      return (
        <f7-block strong>
          {this.showCounter()}
          <f7-button onClick={this.addCounter}>Counter++</f7-button>
        </f7-block>
      );
    },
  },
  render() {
    return null;
  },
};
