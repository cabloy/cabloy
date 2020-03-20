<template>
  <eb-page>
    <eb-navbar large largeTransparent :title="$text('Progress Bar')" eb-back-link="Back"></eb-navbar>
    <f7-block>
      <eb-button :onPerform="onPerformStart">{{$text('Start Working')}}</eb-button>
    </f7-block>
  </eb-page>
</template>
<script>
export default {
  data() {
    return {};
  },
  methods: {
    onPerformStart() {
      return new Promise((resolve, reject) => {
        return this.$api.post('test/feat/progress').then(data => {
          const progressId = data.progressId;
          this.$view.dialog.progressbar({ progressId, title: this.$text('Working') }).then(data => {
            console.log(data);
            resolve();
          }).catch(err => {
            console.error(err);
            reject();
          });
        });
      });
    },
  },
};

</script>
