<template>
  <eb-page :page-content="false" tabs with-subnavbar>
    <eb-navbar :title="$text('Home')" eb-back-link="Back">
      <f7-nav-right>
        <eb-link iconMaterial="search" eb-target="_self" eb-href="menu/search"></eb-link>
      </f7-nav-right>
      <f7-subnavbar>
        <f7-toolbar top tabbar>
          <f7-link :tab-link="`#${tabIdScenes}`" tab-link-active>{{$text('Scenes')}}</f7-link>
          <f7-link :tab-link="`#${tabIdModules}`">{{$text('Modules')}}</f7-link>
          <f7-link :tab-link="`#${tabIdStars}`">{{$text('Stars')}}</f7-link>
        </f7-toolbar>
      </f7-subnavbar>
    </eb-navbar>
    <f7-tabs>
      <eb-tab-page-content :id="tabIdScenes" tab-active>
        <menus slot="list" mode="scenes"></menus>
      </eb-tab-page-content>
      <eb-tab-page-content :id="tabIdModules">
        <menus slot="list" mode="modules"></menus>
      </eb-tab-page-content>
      <eb-tab-page-content :id="tabIdStars">
        <menus slot="list" mode="stars"></menus>
      </eb-tab-page-content>
    </f7-tabs>
  </eb-page>
</template>
<script>
import Vue from 'vue';
import menus from '../../components/menu/list.vue';
export default {
  meta: {
    size: 'middle',
  },
  components: {
    menus,
  },
  data() {
    return {
      tabIdScenes: Vue.prototype.$meta.util.nextId('tab'),
      tabIdModules: Vue.prototype.$meta.util.nextId('tab'),
      tabIdStars: Vue.prototype.$meta.util.nextId('tab'),
    };
  },
};

</script>
