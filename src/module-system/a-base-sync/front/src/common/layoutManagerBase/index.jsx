import Base from './base.jsx';
import Layout from './layout.jsx';
import Page from './page.jsx';
import Data from './data.jsx';
import Filter from './filter.jsx';
import Subnavbar from './subnavbar.jsx';
import Bottombar from './bottombar.jsx';

export default {
  mixins: [Base, Layout, Page, Data, Filter, Subnavbar, Bottombar],
  beforeDestroy() {
    this.$emit('layoutManager:destroy');
  },
};
