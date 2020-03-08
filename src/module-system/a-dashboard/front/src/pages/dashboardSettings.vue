<template>
  <eb-page>
    <eb-navbar :title="$text('Settings')" eb-back-link="Back">
      <f7-nav-right>
        <eb-link iconMaterial="add" :onPerform="onPerformAddWidget"></eb-link>
      </f7-nav-right>
    </eb-navbar>
    <f7-toolbar bottom-md>
      <f7-button></f7-button>
      <f7-button></f7-button>
      <eb-button :onPerform="onPerformSaveAs">{{$text('Save As')}}</eb-button>
    </f7-toolbar>
  </eb-page>
</template>
<script>
export default {
  methods: {
    onPerformAddWidget() {

    },
    onPerformSaveAs() {}
  },
}

</script>
