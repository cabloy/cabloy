<template>
  <eb-page>
    <eb-navbar :title="$text('Hello World')" eb-back-link="Back"> </eb-navbar>
    <f7-block-title>{{$text('TipBasicProcess')}}</f7-block-title>
    <f7-block strong>
      <div class="alert-info">{{message}}</div>
      <p>
        <eb-button :onPerform="onPerformClick">{{$text('Click')}}</eb-button>
      </p>
    </f7-block>
  </eb-page>
</template>
<script>
export default {
  data() {
    return {
      message: null,
    };
  },
  methods: {
    onPerformClick() {
      return this.$api.post('kitchen-sink/hello/echo').then(data => {
        this.message = data;
      });
    },
  },
};

</script>
<style scoped>
</style>
