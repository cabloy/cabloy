import Layout from './layout.jsx';
import Page from './page.jsx';
import Data from './data.jsx';
import Subnavbar from './subnavbar.jsx';
import Bottombar from './bottombar.jsx';
import Actions from './actions.jsx';

export default {
  mixins: [Layout, Page, Data, Subnavbar, Bottombar, Actions],
};
