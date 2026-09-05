import DefaultTheme from 'vitepress/theme';

import GitHubRepositoriesNav from './components/GitHubRepositoriesNav.vue';
import './custom.css';

export default {
  extends: DefaultTheme,
  enhanceApp({ app }) {
    app.component('GitHubRepositoriesNav', GitHubRepositoriesNav);
  },
};
