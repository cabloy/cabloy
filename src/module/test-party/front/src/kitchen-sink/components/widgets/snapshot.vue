<template>
  <f7-card>
    <f7-card-header>{{$text('Snapshots')}}</f7-card-header>
    <f7-card-content>
      <div v-for="item of snapshots" :key="item.widgetId">
        <f7-block-title>{{item.data.title}}</f7-block-title>
        <f7-block class="snapshot">
          <img :src="item.data.image">
        </f7-block>
      </div>
    </f7-card-content>
  </f7-card>
</template>
<script>
export default {
  meta: {
    global: false,
  },
  data() {
    return {
      snapshots: [],
    };
  },
  mounted() {
    this.__init();
  },
  methods: {
    __init() {
      const data = {
        title: 'Apples',
        image: 'https://admin.cabloy.com/api/a/file/file/download/385ca5c51d594e05974e668ad61bd012.JPG',
      };
      this.snapshots.push({
        widgetId: '1',
        data,
      });
    },
  },
};

</script>
<style lang="less" scoped>
.snapshot {
  padding: 8px;
  text-align: center;

  img {
    width: 80%;
  }
}

</style>
