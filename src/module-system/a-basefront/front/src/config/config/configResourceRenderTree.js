const tree = {
  info: {
    layout: {
      items: [{ name: 'accordion' }, { name: 'tree' }],
    },
  },
  layouts: {
    base: {
      blocks: {
        title: {
          component: {
            module: 'a-baselayout',
            name: 'resourceTreeLayoutBlockAccordionTitle',
          },
        },
      },
    },
    accordion: {
      title: 'LayoutAccordion',
      component: {
        module: 'a-baselayout',
        name: 'resourceTreeLayoutAccordion',
      },
      blocks: {
        items: {
          component: {
            module: 'a-baselayout',
            name: 'resourceTreeLayoutBlockAccordionItems',
          },
        },
      },
    },
    tree: {
      title: 'LayoutTree',
      component: {
        module: 'a-baselayout',
        name: 'resourceTreeLayoutTree',
      },
      blocks: {
        items: {
          component: {
            module: 'a-baselayout',
            name: 'resourceTreeLayoutBlockTreeItems',
          },
        },
      },
    },
  },
};
export default tree;
