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

<% if (ctx.mode.capacitor) { %>
  <% if (metaConf.versions.capacitor <= 2) { %>
  import { Plugins } from '@capacitor/core'
  const { SplashScreen } = Plugins
  <% } else /* Capacitor v3+ */ { %>
  import '@capacitor/core'
    <% if (metaConf.versions.capacitorPluginApp) { %>
    // importing it so it can install itself (used by Quasar UI)
    import { App as CapApp } from '@capacitor/app'
    <% } %>
    <% if (metaConf.versions.capacitorPluginSplashscreen && capacitor.hideSplashscreen !== false) { %>
    import { SplashScreen } from '@capacitor/splash-screen'
    <% } %>
  <% } %>
<% } %>

import mainFn from 'boot/main'
import { markRaw } from 'vue'
import <%= metaConf.needsAppMountHook === true ? 'AppComponent' : 'RootComponent' %> from 'app/<%= sourceFiles.rootComponent %>'

<% if (metaConf.needsAppMountHook === true) { %>
import { defineComponent, h, onMounted<%= ctx.mode.ssr && ssr.manualPostHydrationTrigger !== true ? ', getCurrentInstance' : '' %> } from 'vue'
const RootComponent = defineComponent({
  name: 'AppWrapper',
  setup (props) {
    onMounted(() => {
      <% if (ctx.mode.capacitor && metaConf.versions.capacitorPluginSplashscreen && capacitor.hideSplashscreen !== false) { %>
      SplashScreen.hide()
      <% } %>

      <% if (ctx.mode.ssr && ssr.manualPostHydrationTrigger !== true) { %>
      const { proxy: { $q } } = getCurrentInstance()
      $q.onSSRHydrated !== void 0 && $q.onSSRHydrated()
      <% } %>
    })

    return () => h(AppComponent, props)
  }
})
<% } %>

<% if (ctx.mode.ssr && ctx.mode.pwa) { %>
export const ssrIsRunningOnClientPWA = typeof window !== 'undefined' &&
  document.body.getAttribute('data-server-rendered') === null
<% } %>

export default async function (createAppFn<%= ctx.mode.ssr ? ', ssrContext' : '' %>) {
  // Create the app instance.
  // Here we inject into it the Quasar UI, the router & possibly the store.
  const app = createAppFn(RootComponent)

  <% if (metaConf.debugging) { %>
  app.config.performance = true
  <% } %>

  mainFn({app<%= ctx.mode.ssr ? ', ssrContext' : '' %>})

  <% if (ctx.mode.capacitor) { %>
  app.config.globalProperties.$q.capacitor = window.Capacitor
  <% } %>

  // Expose the app, the router and the store.
  // Note that we are not mounting the app here, since bootstrapping will be
  // different depending on whether we are in a browser or on the server.
  return {
    app,
  }
}
