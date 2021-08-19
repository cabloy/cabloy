const tree = {
  info: {
    layout: {
      items: [
        { name: 'accordion', title: 'LayoutAccordion' },
        { name: 'tree', title: 'LayoutTree' },
      ],
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
