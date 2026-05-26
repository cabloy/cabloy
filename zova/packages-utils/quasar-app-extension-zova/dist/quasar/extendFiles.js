import fse from 'fs-extra';
import path from 'node:path';
import { copyTemplateFile, getAbsolutePathOfModule, getOutDir } from 'zova-vite';
import { resolveTemplatePath } from '../utils.js';
export function extendFilesOne(api, flavor) {
    return async function extendFiles() {
        // prepare templates
        await prepareTemplates();
    };
    async function prepareTemplates() {
        // ssr
        if (api.ctx.mode.ssr) {
            // prod
            if (api.ctx.prod) {
                copyTemplateIfNeed(resolveTemplatePath('env/.env.ssr.production'), api.resolve.app('env/.env.ssr.production'));
            }
            // admin/web
            if (flavor === 'admin') {
                copyTemplateIfNeed(resolveTemplatePath('env/.env.ssr.admin'), api.resolve.app('env/.env.ssr.admin'));
            }
            else if (flavor === 'web') {
                copyTemplateIfNeed(resolveTemplatePath('env/.env.ssr.web'), api.resolve.app('env/.env.ssr.web'));
            }
        }
    }
}
export function extendFilesTwo(_api, _flavor) {
    return async function extendFiles() {
        // patch templates
        // await patchTemplates();
        // prepare vuetify
        await prepareVuetify();
    };
    // async function patchTemplates() {
    // app.js
    // fse.copyFileSync(resolveTemplatePath('entry/app.js_'), api.resolve.cli('templates/entry/app.js'));
    // client-entry.js
    // fse.copyFileSync(resolveTemplatePath('entry/client-entry.js_'), api.resolve.cli('templates/entry/client-entry.js'));
    // server-entry.js
    // fse.copyFileSync(
    //   resolveTemplatePath('entry/server-entry.js_'),
    //   api.resolve.cli('templates/entry/server-entry.js'),
    // );
    // ssr: html-template.js
    // await _handleSSRHtmlTemplate();
    // ssr: ssr-devserver.js
    // await _handleSSRDevServer();
    // ssr: ssr-builder.js
    // await _handleSSRBuilder();
    // }
    // // html-template
    // async function _handleSSRHtmlTemplate() {
    //   const fileSrc = api.resolve.cli('lib/utils/html-template.js');
    //   const fileSrcBak = api.resolve.cli('lib/utils/html-template-origin.js');
    //   copyTemplateIfNeed(fileSrc, fileSrcBak);
    //   const content = fse.readFileSync(fileSrcBak).toString();
    //   const contentNew = content
    //     .replace(
    //       'const bodyStartTagRE = /(<body[^>]*)(>)/i',
    //       'const bodyStartTagRE = /(<body[^>]*)(>)/i\nconst bodyEndRE = /(<\\/body>)/i',
    //     )
    //     .replace(
    //       /\.replace\(\s+bodyStartTagRE,/,
    //       `.replace(
    //     bodyEndRE,
    //     (_, tag) => \`{{ ssrContext._meta.endingBodyTags || '' }}\${ tag }\`
    //   )
    //   .replace(
    //     bodyStartTagRE,`,
    //     );
    //   fse.writeFileSync(fileSrc, contentNew);
    // }
    // // ssr-devserver.js
    // async function _handleSSRDevServer() {
    //   const fileSrc = resolveTemplatePath('entry/ssr-devserver.js_');
    //   const fileDest = api.resolve.cli('lib/modes/ssr/ssr-devserver.js');
    //   fse.copyFileSync(fileSrc, fileDest);
    // }
    // // ssr-builder.js
    // async function _handleSSRBuilder() {
    //   const fileSrc = api.resolve.cli('lib/modes/ssr/ssr-builder.js');
    //   const fileSrcBak = api.resolve.cli('lib/modes/ssr/ssr-builder-origin.js');
    //   copyTemplateIfNeed(fileSrc, fileSrcBak);
    //   const content = fse.readFileSync(fileSrcBak).toString();
    //   const contentNew = content
    //     .replace(
    //       'await this.#buildWebserver()',
    //       '',
    //     )
    //     .replace(
    //       'await this.#copyWebserverFiles()',
    //       '',
    //     )
    //     .replace(
    //       'await this.#writePackageJson()',
    //       '',
    //     )
    //     .replace(
    //       "await this.buildWithVite('SSR Server', viteServerConfig)",
    //       "await this.buildWithVite('SSR Server', viteServerConfig)\nawait this.#buildWebserver()",
    //     )
    //     .replace(
    //       "'render-template.js',",
    //       "this.ctx.appPaths.resolve.entry('render-template.js'),",
    //     )
    //     .replace('async #writeRenderTemplate (clientDir) {', `_patchIndexHtml(html){
    //   return html
    //     .replace(/<title>.*?<\\/title>/,'')
    //     .replace(/<meta name="description"[^>]*?>/,'')
    //     .replace(/<link([^>]*?)href="(\\/[^>]*?)>/g,
    //       (_,a,b)=>{return \`<link\${a}href="{{ ssrContext._meta.baseUrl }}\${b}>\`})
    //     .replace(/<script([^>]*?)src="(\\/[^>]*?)><\\/script>/g,
    //       (_,a,b)=>{return \`<script\${a}src="{{ ssrContext._meta.baseUrl }}\${b}></script>\`}) ;
    // }
    //       async #writeRenderTemplate (clientDir) {`)
    //     .replace('const html = this.readFile(htmlFile);', 'const html = this._patchIndexHtml(this.readFile(htmlFile));');
    //   fse.writeFileSync(fileSrc, contentNew);
    // }
    async function prepareVuetify() {
        let modulePath;
        try {
            modulePath = getAbsolutePathOfModule('vuetify', 'lib/framework.js');
        }
        catch (_) { }
        if (!modulePath)
            return;
        // copy
        fse.copyFileSync(resolveTemplatePath('vuetify/composables/hydration.js'), path.join(modulePath, 'lib/composables/hydration.js'));
        fse.copyFileSync(resolveTemplatePath('vuetify/composables/ssrBoot.js'), path.join(modulePath, 'lib/composables/ssrBoot.js'));
    }
}
export function extendFilesThree(conf, api, _flavor) {
    return async function extendFiles() {
        // patch templates
        await patchTemplates();
    };
    async function patchTemplates() {
        // ssr: ssr-prod-webserver.js
        await _handleSSRProdWebserver();
        // ssr: ssr-prod-handler.js
        await _handleSSRProdHandler();
    }
    // ssr-prod-webserver.js
    async function _handleSSRProdWebserver() {
        const fileSrc = resolveTemplatePath('entry/ssr-prod-webserver.js_');
        const fileDest = api.resolve.entry('ssr-prod-webserver.js');
        await copyTemplateFile(fileSrc, fileDest, Object.assign({}, conf, { __outDir__: getOutDir() }));
    }
    // ssr-prod-handler.js
    async function _handleSSRProdHandler() {
        const fileSrc = resolveTemplatePath('entry/ssr-prod-handler.js_');
        const fileDest = api.resolve.entry('ssr-prod-handler.js');
        await copyTemplateFile(fileSrc, fileDest, { __outDir__: getOutDir() });
    }
}
function copyTemplateIfNeed(fileSrc, fileDest) {
    if (!fse.existsSync(fileDest)) {
        fse.copyFileSync(fileSrc, fileDest);
    }
}
//# sourceMappingURL=extendFiles.js.map