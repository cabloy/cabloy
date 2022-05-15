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
      const appKey = this.base.appCurrent.appKey;
      const appItem = this.base.appCurrent.appItem;
      if (!appItem) return '';
      if (this.base_isAppDefault(appKey) || appItem.isolate) return '';
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
    page_onClickAppCurrent(event) {
      console.log(event);
    },
  },
};
