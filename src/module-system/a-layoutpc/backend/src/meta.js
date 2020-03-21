module.exports = app => {
  // meta
  const meta = {
    base: {
      functions: {
        // panels
        panelMenu: {
          title: 'Menu',
          url: '/a/base/menu/list',
          menu: 2,
          public: 1,
        },
        panelAtom: {
          title: 'Atom',
          url: '/a/base/atom/list',
          menu: 2,
          public: 1,
        },
        panelSearch: {
          title: 'Search',
          url: '/a/base/atom/searchQuick',
          menu: 2,
          public: 1,
        },
        // sections
        sectionCopyright: {
          title: 'Copyright',
          component: 'sectionCopyright',
          menu: 4,
          public: 1,
        },
        sectionClock: {
          title: 'Clock',
          component: 'sectionClock',
          menu: 4,
          public: 1,
        },
        // header buttons
        buttonDashboard: {
          title: 'Dashboard',
          component: 'buttonDashboard',
          menu: 5,
          public: 1,
        },
        buttonFullscreen: {
          title: 'Fullscreen',
          component: 'buttonFullscreen',
          menu: 5,
          public: 1,
        },
        buttonMine: {
          title: 'Mine',
          component: 'buttonMine',
          menu: 5,
          public: 1,
        },
      },
    },
  };
  return meta;
};
