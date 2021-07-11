import Vue from 'vue';
import JsxComponent from '../components/jsxComponent.jsx';
export default {
  data() {
    return {
      counter: 1,
      counterComponent: null,
    };
  },
  created() {
    this.counterComponent = new Vue(JsxComponent);
  },
  beforeDestroy() {
    if (this.counterComponent) {
      this.counterComponent.$destroy();
      this.counterComponent = null;
    }
  },
  methods: {
    addCounter() {
      this.counter++;
    },
    showCounter() {
      return <div>Counter: {this.counter}</div>;
    },
  },
  render() {
    return (
      <eb-page>
        <eb-navbar large largeTransparent title="JSX" eb-back-link="Back">
          {' '}
        </eb-navbar>
        <f7-block strong>
          {this.showCounter()}
          <f7-button onClick={this.addCounter}>Counter++</f7-button>
        </f7-block>
        <div> -- demo for jsx component --</div>
        {this.counterComponent.renderContent()}
      </eb-page>
    );
  },
};
