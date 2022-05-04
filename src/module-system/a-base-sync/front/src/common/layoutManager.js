import Layout from './layoutManager/layout.jsx';
import Data from './layoutManager/data.jsx';
import Subnavbar from './layoutManager/subnavbar.jsx';
import Bottombar from './layoutManager/bottombar.jsx';

export default {
  mixins: [Layout, Data, Subnavbar, Bottombar],
};
