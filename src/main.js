
// Import is
import is from 'is-type-of';

// Import Vue
import Vue from 'vue';

// Import F7
import Framework7 from 'framework7';

// Import F7 Vue Plugin
// import Framework7Vue from 'framework7-vue';
import Framework7Vue from 'framework7-vue/dist/framework7-vue.js';

// Import F7 iOS Theme Styles
import Framework7Theme from 'framework7/dist/css/framework7.ios.min.css';
import Framework7ThemeColors from 'framework7/dist/css/framework7.ios.colors.min.css';
/* OR for Material Theme:
import Framework7Theme from 'framework7/dist/css/framework7.material.min.css'
import Framework7ThemeColors from 'framework7/dist/css/framework7.material.colors.min.css'
*/

// Import App Custom Styles
import AppStyles from './css/app.css';

// Import Routes
import Routes from './routes.js';

// Import App Component
import App from './app';

// Init F7 Vue Plugin
Vue.use(Framework7Vue);

// Init App
new Vue({
  el: '#app',
  template: '<app/>',
  // Init Framework7 by passing parameters here
  framework7: {
    root: '#app',
    /* Uncomment to enable Material theme: */
    // material: true,
    routes: Routes,
  },
  // Register App Component
  components: {
    app: App,
  },
  methods: {
    onF7Init(f7) {

      // fix router
      this.fixRouter();

      f7.routerPreOptions = (view, options) => {
        if (options.component === false || !options.url) return options;

        const matchingRoute = this.$f7Router.findMatchingRoute(options.url);
        if (!matchingRoute) return options;

        if (!is.function(matchingRoute.route.component)) return options;

        options.__ebRoute = matchingRoute;
        options.component = true;
        return options;
      };

      f7.componentLoader = (view, options, cb) => {

        if (!options.__ebRoute) return cb(options);

        const f = options.__ebRoute.route.component();
        if (!is.promise(f)) {
          options.__ebRoute.route.component = f.__esModule ? f.default : f;
          options.component = false;
          return cb(options);
        }

        f.then(component => {
          options.__ebRoute.route.component = component.__esModule ? component.default : component;
          options.component = false;
          return cb(options);
        });

      };

    },
    fixRouter() {
      const _findMatchingRoute = this.$f7Router.findMatchingRoute;
      this.$f7Router.findMatchingRoute = url => {
        if (!url) return _findMatchingRoute.call(this.$f7Router, url);
        const parts = url.split('/');
        if (parts.length < 3) return _findMatchingRoute.call(this.$f7Router, url);
        const moduleName = `egg-born-module-${parts[1]}-${parts[2]}`;
        import('../build/modules/' + moduleName + '/dist/front.js').then(m => {
          console.log(m);
        });
      };
    },
    findMatchingRoute(url) {
      let matchingRoute;
      if (!url) { return matchingRoute; }

      const routes = this.routes;
      const query = this.dom7.parseUrlQuery(url);
      const hash = url.split('#')[1];
      const params = {};
      const path = url.split('#')[0].split('?')[0];
      const urlParts = path.split('/').filter(function(part) {
        if (part !== '') { return part; }
      });

      let i,
        j,
        k;
      for (i = 0; i < routes.length; i++) {
        if (matchingRoute) { continue; }
        const route = routes[i];
        const parsedRoute = parseRoute(route.path);
        if (parsedRoute.length !== urlParts.length) { continue; }
        let matchedParts = 0;
        for (j = 0; j < parsedRoute.length; j++) {
          if (typeof parsedRoute[j] === 'string' && urlParts[j] === parsedRoute[j]) { matchedParts++; }
          if (typeof parsedRoute[j] === 'object') {
            params[parsedRoute[j].name] = urlParts[j];
            matchedParts++;
          }
        }
        if (matchedParts === urlParts.length) {
          matchingRoute = {
            query,
            hash,
            params,
            url,
            path,
            route,
          };
        }
      }
      return matchingRoute;
    },

  },
});

