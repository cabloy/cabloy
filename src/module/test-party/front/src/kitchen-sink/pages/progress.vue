<template>
  <eb-page>
    <eb-navbar :title="$text('Progress Bar')" eb-back-link="Back"></eb-navbar>
    <f7-block>
      <eb-link :onPerform="onPerformStart">{{$text('Start Working')}}</eb-link>
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
            console.log(err);
            reject();
          });
        });
      });
    },
  },
};

</script>
