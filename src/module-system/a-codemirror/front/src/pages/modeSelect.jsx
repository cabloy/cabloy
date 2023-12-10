import Vue from 'vue';
const ebPageContext = Vue.prototype.$meta.module.get('a-components').options.mixins.ebPageContext;

const ModesDefault =
  'bash,css,dart,diff,dockerfile,go,html,javascript,lua,markdown,nginx,php,python,ruby,rust,shell,sql,swift,vue,xml,yaml';
export default {
  mixins: [ebPageContext],
  data() {
    return {
      modes: null,
    };
  },
  created() {
    this.init();
  },
  methods: {
    async init() {
      // config
      const layoutConfig = await this.$store.dispatch('a/base/getLayoutConfig', 'a-codemirror');
      this.modes = (layoutConfig.modes || ModesDefault).split(',');
    },
    async _saveConfig() {
      const useStoreLayoutConfig = await this.$store.use('a/basestore/layoutConfig');
      useStoreLayoutConfig.setLayoutConfigKey({
        module: 'a-codemirror',
        key: 'modes',
        value: this.modes.join(','),
      });
    },
    async onPerformAdd() {
      let mode = await this.$view.dialog.prompt(this.$text('Please specify the new code mode'));
      if (!mode) return;
      mode = mode.toLowerCase();
      const index = this.modes.indexOf(mode);
      if (index > -1) {
        this.modes.splice(index, 1);
      }
      this.modes.unshift(mode);
      // save config
      await this._saveConfig();
    },
    async onPerformMode(mode) {
      // switch order
      const index = this.modes.indexOf(mode);
      const items = this.modes.splice(index, 1);
      this.modes.unshift(items[0]);
      // save config
      await this._saveConfig();
      // ok
      const modeInfo = window.CodeMirror.__findMode(mode);
      this.contextCallback(200, { mode, modeInfo });
      this.$f7router.back();
    },
    _renderModes() {
      if (!this.modes) return null;
      const children = [];
      for (const item of this.modes) {
        const classes = {
          chip: true,
          'col-33': true,
          // 'chip-outline': true,
        };
        children.push(
          <eb-button
            class={classes}
            fill
            propsOnPerform={() => {
              this.onPerformMode(item);
            }}
          >
            {item}
          </eb-button>
        );
      }
      return (
        <f7-block>
          <div class="row tags">
            {children}
            <div class="col-33"></div>
            <div class="col-33"></div>
          </div>
        </f7-block>
      );
    },
  },
  render() {
    const domModes = this._renderModes();
    return (
      <eb-page>
        <eb-navbar large largeTransparent title={this.$text('Select Code Mode')} eb-back-link="Back">
          <f7-nav-right>
            <eb-link iconF7="::add" propsOnPerform={this.onPerformAdd}></eb-link>
          </f7-nav-right>
        </eb-navbar>
        <div class="eb-tag-select">{domModes}</div>
      </eb-page>
    );
  },
};
