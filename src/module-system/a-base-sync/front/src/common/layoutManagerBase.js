import Layout from './layoutManagerBase/layout.jsx';
import Data from './layoutManagerBase/data.jsx';
import Subnavbar from './layoutManagerBase/subnavbar.jsx';
import Bottombar from './layoutManagerBase/bottombar.jsx';

export default {
  mixins: [Layout, Data, Subnavbar, Bottombar],
};
