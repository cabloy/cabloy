import LayoutBase from './layoutManager/layoutBase.jsx';
import Data from './layoutManager/data.jsx';
import Subnavbar from './layoutManager/subnavbar.jsx';
import Bottombar from './layoutManager/bottombar.jsx';

export default {
  mixins: [LayoutBase, Data, Subnavbar, Bottombar],
};
