export default {
  data() {
    return {};
  },
  methods: {
    page_onGetTitle() {
      return this.$text('Mine');
    },
    page_onGetTitleSub() {
      return this.page_renderAppCurrent();
    },
    page_renderAppCurrent() {
      const { appKey, appItem } = this.base.appInfoCurrent;
      if (!appItem) return '';
      if (this.base.appInfos.length === 1 || appItem.appIsolate) return '';
      return (
        <f7-chip
          iconF7={appItem.appIcon}
          iconSize="16"
          class="eb-app-mine-title-sub eb-cursor-pointer"
          nativeOnClick={this.page_onClickAppCurrent}
        >
          {appItem.atomNameLocale}
        </f7-chip>
      );
    },
    async page_onClickAppCurrent(event) {
      try {
        const appInfoCurrent = this.base.appInfoCurrent;
        const { appKey, appItem, appMineLayout } = appInfoCurrent;
        if (!appItem) return '';
        // icon
        const iconDone = await this.$meta.util.combineIcon({ f7: '::done' });
        // buttons
        const buttons = [];
        for (const appInfo of this.base.appInfos) {
          const icon = this.base_app_isCurrentSame(appInfo, appInfoCurrent) ? iconDone : this.$meta.util.emptyIcon;
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
      } catch (err) {
        // do nothing
      }
    },
  },
};
