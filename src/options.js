/*
* @Author: zhennann
* @Date:   2017-09-10 21:31:56
* @Last Modified by:   zhennann
* @Last Modified time: 2017-09-11 00:03:12
*/

// vue options
export default function(Vue) {

  return {

    methods: {

      onF7Init(f7) {

        f7.routerPreOptions = (view, options) => {
          if (options.component === false || !options.url) return options;

          // parse module info
          const moduleInfo = this.parseModuleInfo(options.url);
          if (!moduleInfo) return options;

          // check if module loaded
          if (!this.$f7Router.__ebModules) this.$f7Router.__ebModules = {};
          if (this.$f7Router.__ebModules[moduleInfo.fullName]) return options;

          options.__ebModuleInfo = moduleInfo;
          options.component = true;
          return options;
        };

        f7.componentLoader = (view, options, cb) => {
          if (!options.__ebModuleInfo) return cb(options);

          const moduleInfo = options.__ebModuleInfo;

          this.importCSS(moduleInfo, () => {

            this.importJS(moduleInfo, (e, m) => {
              if (e) throw e;

              this.installJS(m, options, moduleInfo);

              return cb(options);
            });
          });

        };

      },

      importCSS(moduleInfo, cb) {
      import('../build/__module/' + moduleInfo.fullName + '/dist/front.css').then(() => {
        return cb(null);
      }).catch(e => {
        return cb(e);
      });
      },

      importJS(moduleInfo, cb) {
      import('../build/__module/' + moduleInfo.fullName + '/dist/front.js').then(m => {
        return cb(null, m);
      }).catch(() => {
        import('../../../module/' + moduleInfo.relativeName + '/front/src/main.js').then(m => {
          return cb(null, m);
        }).catch(e => {
          return cb(e);
        });
      });
      },

      installJS(m, options, moduleInfo) {
      // install
        Vue.use(m.default);

        // concat routes
        const routes = m.default.routes.map(route => {
          route.path = `/${moduleInfo.pid}/${moduleInfo.name}${route.path}`;
          return route;
        });
        this.$f7Router.routes = this.$f7Router.routes.concat(routes);

        // ready
        this.$f7Router.__ebModules[moduleInfo.fullName] = m;
        options.component = false;
      },

      parseModuleInfo(url) {
        const parts = url.split('/');
        if (parts.length < 3) return null;
        return {
          pid: parts[1],
          name: parts[2],
          fullName: `egg-born-module-${parts[1]}-${parts[2]}`,
          relativeName: `${parts[1]}-${parts[2]}`,
        };
      },

    },

  };

}
