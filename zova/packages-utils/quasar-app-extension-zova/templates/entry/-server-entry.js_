/* eslint-disable */
/**
 * THIS FILE IS GENERATED AUTOMATICALLY.
 * DO NOT EDIT.
 *
 * You are probably looking on adding startup/initialization code.
 * Use "quasar new boot <name>" and add it there.
 * One boot file per concern. Then reference the file(s) in quasar.config file > boot:
 * boot: ['file', ...] // do not add ".js" extension to it.
 *
 * Boot files are your "main.js"
 **/
import { sys } from 'zova';
import { getPluginZovaOptions } from 'app/.zova/app/utils.js';
import { createApp<%= metaConf.hasStore && ssr.manualStoreSsrContextInjection !== true ? ', unref' : '' %> } from 'vue'

<% extras.length !== 0 && extras.filter(asset => asset).forEach(asset => { %>
import '@quasar/extras/<%= asset %>/<%= asset %>.css'
<% }) %>

<% animations.length !== 0 && animations.filter(asset => asset).forEach(asset => { %>
import '@quasar/extras/animate/<%= asset %>.css'
<% }) %>

<% if (framework.cssAddon) { %>
// We add Quasar addons, if they were requested
import 'quasar/src/css/flex-addon.sass'
<% } %>

<% css.length !== 0 && css.filter(asset => asset.server !== false).forEach(asset => { %>
import '<%= asset.path %>'
<% }) %>

import createQuasarApp from './app.js'

<% if (preFetch) { %>
import App from 'app/<%= sourceFiles.rootComponent %>'
const appPrefetch = typeof App.preFetch === 'function'
  ? App.preFetch
  : (
    // Class components return the component options (and the preFetch hook) inside __c property
    App.__c !== void 0 && typeof App.__c.preFetch === 'function'
      ? App.__c.preFetch
      : false
    )
<% } %>

// This is where we perform data-prefetching to determine the
// state of our application before actually rendering it.
// Since data fetching is async, this function is expected to
// return a Promise that resolves to the app instance.
export default async ssrContext => {
    const {
      app
    } = await createQuasarApp(createApp, ssrContext)

    <%
      const bootEntries = boot.filter(asset => asset.server !== false)
      if (bootEntries.length !== 0) { %>
    const bootFunctions = await Promise.all([
      <% bootEntries.forEach((asset, index) => { %>
      import('<%= asset.path %>')<%= index < bootEntries.length - 1 ? ',' : '' %>
      <% }) %>
    ]).then(bootFiles => bootFiles.map(entry => entry.default).filter(entry => typeof entry === 'function'))
    <% } %>

    <% if (bootEntries.length !== 0) { %>
    
    for (let i = 0; i < bootFunctions.length; i++) {
      await bootFunctions[i]({
        app,
        ssrContext,
      })
    }

    <% } %>

    return app;
}

export async function initialize(envRuntime) {
  await sys.initialize(getPluginZovaOptions(), envRuntime);
  return sys;
}