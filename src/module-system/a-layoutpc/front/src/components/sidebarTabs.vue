<script>
export default {
  render(c) {
    const buttons = [];
    buttons.push(c('f7-link', {
      staticClass: 'active',
      props: {
        text: 'test',
      }
    }));
    buttons.push(c('f7-link', {
      props: {
        text: 'test2',
      }
    }));
    buttons.push(c('f7-link', {
      props: {
        text: 'test3333',
      }
    }));
    buttons.push(c('f7-link', {
      props: {
        text: '风华正茂',
      }
    }));
    return c('div', { staticClass: `eb-layout-sidebar-tabs eb-layout-sidebar-tabs-${this.side}` }, buttons);
  },
  props: {
    side: {
      type: String,
    }
  },
  data() {
    return {}
  },
}

</script>
