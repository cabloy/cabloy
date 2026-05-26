import { mergeConfig } from 'vite';
import { generateZovaViteMeta } from 'zova-vite';
export function extendQuasarConf(context, flavor) {
    return async function extendQuasarConf(conf, api) {
        const appPaths = api.ctx.appPaths;
        const mode = api.ctx.prod ? 'production' : 'development';
        const appMode = api.ctx.modeName;
        const configMeta = {
            flavor,
            mode,
            appMode,
        };
        const configOptions = {
            appDir: appPaths.appDir,
            runtimeDir: '.zova',
            zovaManualChunk: conf.zovaManualChunk,
        };
        // zovaViteMeta
        context.configMeta = configMeta;
        context.configOptions = configOptions;
        const zovaViteMeta = (context.zovaViteMeta = await generateZovaViteMeta(configMeta, configOptions));
        // boot
        if (!conf.boot)
            conf.boot = [];
        conf.boot.unshift('zova');
        // build: alias
        conf.build = mergeConfig(conf.build || {}, {
            alias: zovaViteMeta.viteConfig.resolve.alias,
            // not set env here
            // env: zovaViteMeta.env,
        });
        // build: publicPath
        conf.build.publicPath = process.env.APP_PUBLIC_PATH;
        // build: vueRouterMode/vueRouterBase
        conf.build.vueRouterMode = process.env.ROUTER_MODE;
        conf.build.vueRouterBase = process.env.APP_PUBLIC_PATH;
        // build: vitePlugins
        const vitePlugins = zovaViteMeta.vitePlugins.map(item => {
            return [item[1], item[2], item[3]];
        });
        conf.build.vitePlugins = (conf.build.vitePlugins || []).concat(vitePlugins);
        // build: distDir
        conf.build.distDir = zovaViteMeta.viteConfig.build.outDir;
        // build: analyze
        conf.build.analyze = conf.build.analyze ?? process.env.BUILD_ANALYZE === 'true';
        // build: target
        conf.build.target = {
            browser: conf.build.target?.browser ?? process.env.BUILD_TARGET_BROWSER?.split(','),
            node: conf.build.target?.node ?? process.env.BUILD_TARGET_NODE,
        };
        // devServer
        conf.devServer = mergeConfig(conf.devServer || {}, zovaViteMeta.viteConfig.server);
        // ssr: middlewares
        const ssrMiddlewares = (conf.ssr?.middlewares || []).concat('render');
        // ssr
        conf.ssr = mergeConfig(conf.ssr || {}, {
            middlewares: ssrMiddlewares,
            prodPort: Number(process.env.SSR_PROD_PORT),
            manualStoreSerialization: true,
            manualStoreSsrContextInjection: true,
            manualStoreHydration: true,
            manualPostHydrationTrigger: true,
        });
        // sourceFiles
        conf.sourceFiles = mergeConfig(conf.sourceFiles || {}, {
            rootComponent: 'src/boot/app/index.js',
            router: 'src/boot/router',
        });
    };
}
//# sourceMappingURL=extendQuasarConf.js.map