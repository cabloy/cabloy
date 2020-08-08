<template>
  <eb-page>
    <eb-navbar large largeTransparent :title="$text('File Upload')" eb-back-link="Back"></eb-navbar>
    <f7-card>
      <f7-card-header>{{$text('Image')}}</f7-card-header>
      <f7-card-content>
        <img v-if="imageUrl" class="image" :src="imageUrl">
        <eb-button :onPerform="onPerformImage">{{$text('Select And Upload')}}</eb-button>
      </f7-card-content>
    </f7-card>
    <f7-card>
      <f7-card-header>{{$text('Audio')}}</f7-card-header>
      <f7-card-content>
        <audio v-if="audioUrl" :src="audioUrl" controls autoplay></audio>
        <eb-button :onPerform="onPerformAudio">{{$text('Select And Upload')}}</eb-button>
      </f7-card-content>
    </f7-card>
    <f7-card>
      <f7-card-header>{{$text('File')}}</f7-card-header>
      <f7-card-content>
        <pre v-if="file">{{getFileJSON(this.file)}}</pre>
        <f7-button @click="onClickFile">{{$text('Select And Upload')}}</f7-button>
      </f7-card-content>
    </f7-card>
  </eb-page>
</template>
<script>
export default {
  data() {
    return {
      imageUrl: null,
      audioUrl: null,
      file: null,
    };
  },
  methods: {
    onPerformImage() {
      return new Promise((resolve, reject) => {
        this.$view.navigate('/a/file/file/upload', {
          context: {
            params: {
              mode: 1,
              // atomId: 0,
            },
            callback: (code, data) => {
              if (code === 200) {
                this.imageUrl = data.downloadUrl;
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
    onPerformAudio() {
      return this.$view.navigate('/a/file/file/upload', {
        context: {
          params: {
            mode: 3,
            // atomId: 0,
          },
          callback: (code, data) => {
            if (code === 200) {
              this.audioUrl = data.downloadUrl;
            }
          },
        },
      });
    },
    onClickFile() {
      this.$view.navigate('/a/file/file/upload', {
        context: {
          params: {
            mode: 2,
            // atomId: 0,
          },
          callback: (code, data) => {
            if (code === 200) {
              this.file = data;
            }
          },
        },
      });
    },
    getFileJSON(file) {
      return JSON5.stringify(this.file, null, 2);
    },
  },
};

</script>
<style lang="less" scoped="">
.image {
  width: 100%;
  max-height: 300px;
}

</style>
