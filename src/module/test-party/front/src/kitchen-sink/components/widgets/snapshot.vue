<template>
  <f7-card>
    <f7-card-header>{{$text('Snapshots')}}</f7-card-header>
    <f7-card-content>
      <template v-for="item of snapshots">
        <f7-block-title>{{item.title}}</f7-block-title>
        <f7-block class="snapshot">
          <img :src="item.image">
        </f7-block>
      </template>
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
      this.snapshots.push({
        name: 'fruit',
        title: 'Apples',
        image: 'https://admin.cabloy.com/api/a/file/file/download/385ca5c51d594e05974e668ad61bd012.JPG',
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
