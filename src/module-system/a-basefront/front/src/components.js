import combineSearch from './components/action/combineSearch.js';
import componentAction from './components/render/componentAction.jsx';
import renderAtom from './components/render/renderAtom.jsx';
import renderAtomClass from './components/render/renderAtomClass.jsx';
import renderLanguage from './components/render/renderLanguage.jsx';
import renderCategory from './components/render/renderCategory.jsx';
import renderCategoryResource from './components/render/renderCategoryResource.jsx';
import renderTags from './components/render/renderTags.jsx';
import renderResourceType from './components/render/renderResourceType.jsx';
import renderTableCellDefault from './components/render/renderTableCellDefault.jsx';
import renderTableCellComputed from './components/render/renderTableCellComputed.jsx';
import renderTableCellDatetime from './components/render/renderTableCellDatetime.jsx';
import renderTableCellLink from './components/render/renderTableCellLink.jsx';
import renderTableCellButton from './components/render/renderTableCellButton.jsx';
import renderUserLabel from './components/render/renderUserLabel.jsx';
import renderUser from './components/render/renderUser.jsx';
import renderRole from './components/render/renderRole.jsx';
// category
import categorySelect from './components/category/categorySelect.jsx';
// tag
import tagSelect from './components/tag/tagSelect.jsx';
// tab
import atomTab from './components/tab/atomTab.jsx';
// listLayoutData
import listLayoutDataAdapter from './components/listLayoutData/adapter.jsx';
import listLayoutDataProviderContinuous from './components/listLayoutData/providerContinuous.jsx';
import listLayoutDataProviderPaged from './components/listLayoutData/providerPaged.jsx';
// tools
import developerTool from './components/tools/developerTool.js';

export default {
  combineSearch,
  componentAction,
  renderAtom,
  renderAtomClass,
  renderLanguage,
  renderCategory,
  renderCategoryResource,
  renderTags,
  renderResourceType,
  renderTableCellDefault,
  renderTableCellComputed,
  renderTableCellDatetime,
  renderTableCellLink,
  renderTableCellButton,
  renderUserLabel,
  renderUser,
  renderRole,
  // category
  categorySelect,
  // tag
  tagSelect,
  // tab
  atomTab,
  // layout
  listLayoutDataAdapter,
  listLayoutDataProviderContinuous,
  listLayoutDataProviderPaged,
  // developerTool
  developerTool,
};
