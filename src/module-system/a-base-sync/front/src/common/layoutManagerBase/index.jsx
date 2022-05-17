import Base from './base.jsx';
import Layout from './layout.jsx';
import Page from './page.jsx';
import Data from './data.jsx';
import Filter from './filter.jsx';
import Subnavbar from './subnavbar.jsx';
import Bottombar from './bottombar.jsx';
import Bulk from './bulk.jsx';

export default {
  mixins: [Base, Layout, Page, Data, Filter, Subnavbar, Bottombar, Bulk],
  beforeDestroy() {
    this.$emit('layoutManager:destroy');
  },
};
