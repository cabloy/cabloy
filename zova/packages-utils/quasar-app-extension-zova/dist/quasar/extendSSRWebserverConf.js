import { getOutDir } from 'zova-vite';
export function extendSSRWebserverConf(context) {
    return function extendSSRWebserverConf(conf, api) {
        if (context.configMeta?.mode !== 'production')
            return;
        conf.minify = process.env.BUILD_MINIFY === 'true';
        conf.sourcemap = _normalizeSourcemap(process.env.BUILD_SOURCEMAP);
        conf.keepNames = true;
        conf.bundle = true;
        conf.external = [];
        // conf.banner = { js: "import { createRequire } from 'module';const require = createRequire(import.meta.url);" };
        // conf.entryPoints = [
        //   { in: (api.resolve as any).entry('ssr-prod-webserver.js'), out: 'index' },
        //   { in: (api.resolve as any).entry('ssr-prod-handler.js'), out: 'handler' },
        // ];
        conf.outdir = getOutDir();
        delete conf.outfile;
        // buildsPatch
        conf.buildsPatch = [
            {
                banner: {
                    js: "import { createRequire } from 'module';const require = createRequire(import.meta.url);",
                },
                entryPoints: [{ in: api.resolve.entry('ssr-prod-webserver.js'), out: 'index' }],
            },
            {
                entryPoints: [{ in: api.resolve.entry('ssr-prod-handler.js'), out: 'handler' }],
            },
        ];
    };
}
function _normalizeSourcemap(sourcemap) {
    if (sourcemap === undefined || sourcemap === '')
        return false;
    if (sourcemap === 'true')
        return true;
    if (sourcemap === 'false')
        return false;
    return sourcemap;
}
//# sourceMappingURL=extendSSRWebserverConf.js.map