export default {
  appKey: {
    default: 'a-app:appDefault',
    base: 'a-app:appBase',
    unclassified: 'a-appbooster:appUnclassified',
    general: 'a-appbooster:appGeneral',
  },
  appMenu: {
    categoriesTop: {
      'a-app:appDefault': [
        'AppCategoryServices',
        'AppCategoryCMS',
        'AppCategoryBusiness',
        'AppCategoryManagement',
        'AppCategorySettings',
      ],
      'a-appbooster:appGeneral': ['Create', 'List', 'Tools'],
      'a-appbooster:appSystem': ['BasicProfile', 'BasicAdmin', 'Settings', 'Tools'],
    },
  },
};
