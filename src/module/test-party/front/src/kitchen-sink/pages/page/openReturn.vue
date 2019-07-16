<template>
  <eb-page>
    <eb-navbar :title="$text('Page Open & Return Value')" eb-back-link="Back"></eb-navbar>
    <f7-block>
      <div class="alert-info">{{value}}</div>
      <eb-link :onPerform="onPerformOpen">{{$text('Open Page')}}</eb-link>
    </f7-block>
  </eb-page>
</template>
<script>
export default {
  data() {
    return {
      value: 1,
    };
  },
  methods: {
    onPerformOpen() {
      return new Promise((resolve, reject) => {
        this.$view.navigate('/test/party/kitchen-sink/page/pageReturn', {
          context: {
            params: {
              value: this.value,
            },
            callback: (code, data) => {
              if (code === 200) {
                this.value = data.value;
                resolve();
              }
              if (code === false) {
                reject();
              }
            },
          },
        });
      });
    },
  },
};

</script>
