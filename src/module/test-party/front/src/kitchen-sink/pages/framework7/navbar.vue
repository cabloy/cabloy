<template>
  <eb-page>
    <eb-navbar large largeTransparent :title="$text('Navbar')" subtitle="Subtitle" eb-back-link="Back">
      <f7-nav-right>
        <f7-link>Right</f7-link>
      </f7-nav-right>
    </eb-navbar>
    <f7-block>
      <p>Navbar is a fixed (with Fixed and Through layout types) area at the top of a screen that contains Page title and navigation elements.</p>
      <p>Navbar has 3 main parts: Left, Title and Right. Each part may contain any HTML content.</p>
    </f7-block>
    <f7-list>
      <eb-list-item link="#" eb-href="kitchen-sink/framework7/navbar-hide-scroll" title="Hide Navbar On Scroll"></eb-list-item>
    </f7-list>
  </eb-page>
</template>
<script>
export default {};

</script>
