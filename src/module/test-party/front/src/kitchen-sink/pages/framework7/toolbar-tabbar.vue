<template>
  <eb-page>
    <eb-navbar :title="$text('Toolbar & Tabbar')" eb-back-link="Back"></eb-navbar>
    <f7-toolbar :position="toolbarPosition">
      <f7-link>Left Link</f7-link>
      <f7-link>Right Link</f7-link>
    </f7-toolbar>
    <f7-list>
      <eb-list-item link="#" eb-href="kitchen-sink/framework7/tabbar" title="Tabbar"></eb-list-item>
      <eb-list-item link="#" eb-href="kitchen-sink/framework7/tabbar-labels" title="Tabbar With Labels"></eb-list-item>
      <eb-list-item link="#" eb-href="kitchen-sink/framework7/tabbar-scrollable" title="Tabbar Scrollable"></eb-list-item>
      <eb-list-item link="#" eb-href="kitchen-sink/framework7/toolbar-hide-scroll" title="Hide Toolbar On Scroll"></eb-list-item>
    </f7-list>
    <f7-block-title>Toolbar Position</f7-block-title>
    <f7-block>
      <p>Toolbar supports both top and bottom positions. Click the following button to change its position.</p>
      <p>
        <f7-button fill @click="toggleToolbarPosition">Toggle Toolbar Position</f7-button>
      </p>
    </f7-block>
  </eb-page>
</template>
<script>
export default {
  data() {
    return {
      toolbarPosition: 'bottom',
    };
  },
  methods: {
    toggleToolbarPosition() {
      this.toolbarPosition = this.toolbarPosition === 'top' ? 'bottom' : 'top';
    },
  },
};

</script>
