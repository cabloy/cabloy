<template>
  <eb-page>
    <eb-navbar large largeTransparent :title="$text('RadioBox')" eb-back-link="Back"></eb-navbar>
    <f7-block-title>Inline</f7-block-title>
    <f7-block strong>
      <p>Lorem <f7-radio name="demo-radio-inline"></f7-radio> ipsum dolor sit amet, consectetur adipisicing elit. Alias beatae illo nihil aut eius commodi sint eveniet aliquid eligendi <f7-radio name="demo-radio-inline" checked></f7-radio> ad delectus impedit tempore nemo, enim vel praesentium consequatur nulla mollitia!</p>
    </f7-block>
    <f7-block-title>Radio Group</f7-block-title>
    <f7-list>
      <f7-list-item radio title="Books" name="demo-radio" checked></f7-list-item>
      <f7-list-item radio title="Movies" name="demo-radio"></f7-list-item>
      <f7-list-item radio title="Food" name="demo-radio"></f7-list-item>
      <f7-list-item radio title="Drinks" name="demo-radio"></f7-list-item>
    </f7-list>
    <f7-block-title>With Media Lists</f7-block-title>
    <f7-list media-list>
      <f7-list-item radio checked name="demo-media-radio" value="1" title="Facebook" after="17:14" subtitle="New messages from John Doe" text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla sagittis tellus ut turpis condimentum, ut dignissim lacus tincidunt. Cras dolor metus, ultrices condimentum sodales sit amet, pharetra sodales eros. Phasellus vel felis tellus. Mauris rutrum ligula nec dapibus feugiat. In vel dui laoreet, commodo augue id, pulvinar lacus."></f7-list-item>
      <f7-list-item radio name="demo-media-radio" value="2" title="John Doe (via Twitter)" after="17:11" subtitle="John Doe (@_johndoe) mentioned you on Twitter!" text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla sagittis tellus ut turpis condimentum, ut dignissim lacus tincidunt. Cras dolor metus, ultrices condimentum sodales sit amet, pharetra sodales eros. Phasellus vel felis tellus. Mauris rutrum ligula nec dapibus feugiat. In vel dui laoreet, commodo augue id, pulvinar lacus."></f7-list-item>
      <f7-list-item radio name="demo-media-radio" value="3" title="Facebook" after="16:48" subtitle="New messages from John Doe" text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla sagittis tellus ut turpis condimentum, ut dignissim lacus tincidunt. Cras dolor metus, ultrices condimentum sodales sit amet, pharetra sodales eros. Phasellus vel felis tellus. Mauris rutrum ligula nec dapibus feugiat. In vel dui laoreet, commodo augue id, pulvinar lacus."></f7-list-item>
      <f7-list-item radio name="demo-media-radio" value="4" title="John Doe (via Twitter)" after="15:32" subtitle="John Doe (@_johndoe) mentioned you on Twitter!" text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla sagittis tellus ut turpis condimentum, ut dignissim lacus tincidunt. Cras dolor metus, ultrices condimentum sodales sit amet, pharetra sodales eros. Phasellus vel felis tellus. Mauris rutrum ligula nec dapibus feugiat. In vel dui laoreet, commodo augue id, pulvinar lacus."></f7-list-item>
    </f7-list>
  </eb-page>
</template>
<script>
export default {};

</script>
