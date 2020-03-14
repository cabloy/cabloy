<template>
  <div>
    <f7-block-title>{{$text('Global Component')}}</f7-block-title>
    <f7-block strong>
      <img class="hello" src="../../assets/img/mountains.jpg">
    </f7-block>
  </div>
</template>
<script>
export default {
  meta: {
    global: true,
  },
  data() {
    return {};
  },
};

</script>
<style scoped>
.hello {
  display: block;
  margin: 0 auto;
  width: 80%;
}

</style>
