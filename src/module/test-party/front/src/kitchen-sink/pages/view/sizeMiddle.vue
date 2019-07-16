<template>
  <eb-page>
    <eb-navbar :title="title" eb-back-link="Back"></eb-navbar>
    <f7-block>
      <div class="alert-info">
        {{ $text('Please preview this page in PC mode') }}
      </div>
    </f7-block>
  </eb-page>
</template>
<script>
export default {
  meta: {
    size: 'middle',
  },
  data() {
    return {};
  },
  computed: {
    title() {
      return `${this.$text('View Size')}: Middle`;
    },
  },
};

</script>
