import zhCN from '@zhennann/ant-design-vue/es/locale-provider/zh_CN';

export default {
  meta: {
    global: false,
  },
  methods: {
    onAction({ action }) {
      if (action.name === 'locales') {
        const locales = {
          'zh-cn': zhCN,
        };
        return locales;
      }
    },
  },
};
