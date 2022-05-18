export default {
  data() {
    return {};
  },
  methods: {
    bulk_onPerformAppDefault() {
      const __appKeyDefault = this.$config.appKey.default;
      this.$meta.vueLayout.app_openHome({
        view: this.$view,
        appKey: __appKeyDefault,
      });
    },
    bulk_onPerformSearch() {
      this.$view.navigate('/a/basefront/atom/searchQuick', {
        target: '_self',
      });
    },
    async bulk_onPerformLanguage() {
      // icon
      const iconDone = await this.$meta.util.combineIcon({ f7: '::done' });
      // buttons
      const buttons = [];
      for (const appInfo of this.base.appInfos) {
        const icon = this.base_app_isCurrentSame(appInfo, appInfoCurrent) ? iconDone : '<i class="icon"></i>';
        buttons.push({
          icon,
          text: appInfo.appItem.atomNameLocale,
          data: appInfo,
        });
      }
      // choose
      const params = {
        forceToPopover: true,
        targetEl: event.targetEl,
        buttons,
      };
      const button = await this.$view.actions.choose(params);
      if (!this.base_app_isCurrentSame(button.data, appInfoCurrent)) {
        await this.base_app_switch({ appKey: button.data.appKey });
      }
    },
    bulk_renderAppDefault() {
      // layout
      if (this.$meta.vueApp.layout !== 'mobile') return null;
      // backLink
      const backLink = this.$meta.vueLayout.backLink(this.$view);
      if (backLink) return null;
      // childMode
      if (!this.base_isChildMode()) return null;
      return (
        <eb-link
          key="appDefault"
          iconF7=":outline:apps-outline"
          propsOnPerform={this.bulk_onPerformAppDefault}
        ></eb-link>
      );
    },
    bulk_renderSearch() {
      // layout
      if (this.$meta.vueApp.layout !== 'mobile') return null;
      return <eb-link key="search" iconF7="::search" propsOnPerform={this.bulk_onPerformSearch}></eb-link>;
    },
    bulk_renderLanguage() {
      if (!this.base.appItem.appLanguage) return null;
      return <eb-link key="language" iconF7="::language" propsOnPerform={this.bulk_onPerformLanguage}></eb-link>;
    },
    bulk_renderActionsNormal() {
      const children = [];
      // appDefault
      children.push(this.bulk_renderAppDefault());
      // search
      children.push(this.bulk_renderSearch());
      // language
      children.push(this.bulk_renderLanguage());
      // ok
      return children;
    },
  },
};
