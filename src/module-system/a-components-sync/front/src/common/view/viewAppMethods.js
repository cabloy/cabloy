import AppMethodsFn from '../appMethods.js';
export default {
  data() {
    const appMethods = AppMethodsFn(this);
    return appMethods;
  },
  beforeDestroy() {
    this.calendar = null;
    this.toast = null;
    this.dialog = null;
    this.actions = null;
  },
};
