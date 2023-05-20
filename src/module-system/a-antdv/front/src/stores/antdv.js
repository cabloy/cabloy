import zhCN from '@zhennann/ant-design-vue/es/locale-provider/zh_CN';

export default {
  state() {
    return {};
  },
  actions: {
    getLocales() {
      const locales = {
        'zh-cn': zhCN,
      };
      return locales;
    },
  },
};
