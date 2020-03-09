<script>
const _colWidths = [5, 10, 15, 20, 25, 30, 33, 35, 40, 45, 50, 55, 60, 65, 66, 70, 75, 80, 85, 90, 95, 100];
import widget from './widget.vue';
import widgetToolbar from './widgetToolbar.vue';
export default {
  components: {
    widget,
    widgetToolbar,
  },
  render(c) {
    const children = [];
    if (this.ready) {
      // row
      children.push(this.__renderRow(c));
      // settings
      children.push(c('f7-link', {
        staticClass: 'dashboard-settings',
        attrs: {
          iconMaterial: 'settings'
        },
        on: {
          click: this.onClickSettings,
        }
      }));
    }
    return c('eb-page', {}, children);
  },
  data() {
    return {
      ready: false,
      widgetsAll: null,
      profile: null,
      profileId: 0,
      dragdropSceneResize: Vue.prototype.$meta.util.nextId('dragdrop'),
      dragdropScene: Vue.prototype.$meta.util.nextId('dragdrop'),
    };
  },
}
