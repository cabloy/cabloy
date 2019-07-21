<template>
  <eb-page>
    <eb-navbar :title="$text('Subnavbar')" eb-back-link="Back">
      <f7-subnavbar>
        <f7-segmented>
          <f7-button outline active>Link 1</f7-button>
          <f7-button outline>Link 2</f7-button>
          <f7-button outline>Link 3</f7-button>
        </f7-segmented>
      </f7-subnavbar>
    </eb-navbar>
    <f7-block>
      <p>Subnavbar is useful when you need to put any additional elements into Navbar, like Tab Links or Search Bar. It also remains visible when Navbar hidden.</p>
    </f7-block>
    <f7-list>
      <eb-list-item link="#" eb-href="kitchen-sink/framework7/subnavbar-title" title="Subnavbar Title"></eb-list-item>
    </f7-list>
  </eb-page>
</template>
<script>
export default {};

</script>
