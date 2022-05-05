import Layout from './layoutManagerBase/layout.jsx';
import Page from './layoutManagerBase/page.jsx';
import Data from './layoutManagerBase/data.jsx';
import Subnavbar from './layoutManagerBase/subnavbar.jsx';
import Bottombar from './layoutManagerBase/bottombar.jsx';

export default {
  mixins: [Layout, Page, Data, Subnavbar, Bottombar],
};
