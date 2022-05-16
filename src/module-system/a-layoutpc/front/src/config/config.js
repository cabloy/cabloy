export default {
  layout: {
    default: {
      login: '/a/login/login',
      loginOnStart: true,
      autoHideSidebarOnOpenPage: false,
      sidebar: {
        top: {
          buttons: [],
        },
        left: {
          opened: false,
          cover: true,
          panelWidth: 280,
          tabsWidth: 24,
          toolbarHeight: 24,
          panelActive: '',
          panels: [],
        },
        right: {
          opened: false,
          cover: true,
          panelWidth: 280,
          tabsWidth: 24,
          toolbarHeight: 24,
          panelActive: '',
          panels: [],
        },
        bottom: {
          opened: false,
          cover: true,
          panelHeight: 280,
          tabsHeight: 24,
          toolbarHeight: 24,
          panelActive: '',
          panels: [],
          buttons: [],
        },
      },
      size: {
        small: 320,
        top: 60,
        spacing: 8,
      },
    },
  },
};
