<template>
  <eb-page>
    <eb-navbar :title="title" eb-back-link="Back"></eb-navbar>
    <div>
      <img ref="image" class="image">
    </div>
    <input ref="file" type="file" :accept="accept" @change="onFileChange" style="display: none;">
    <f7-block>
      <h2>{{fileName}}</h2>
    </f7-block>
    <f7-block>
      <f7-segmented raised tag="p">
        <f7-button @click="onClickSelect">{{selectText}}</f7-button>
        <f7-button v-if="cropped" @click="onClickClearCrop">{{$text('Clear Crop')}}</f7-button>
        <eb-button v-if="fileName" active :onPerform="onPerformUpload">{{$text('Upload')}}</eb-button>
      </f7-segmented>
    </f7-block>
  </eb-page>
</template>
<script>
import Vue from 'vue';
import Cropper from 'cropperjs';
const ebPageContext = Vue.prototype.$meta.module.get('a-components').options.components.ebPageContext;
export default {
  mixins: [ ebPageContext ],
  data() {
    return {
      cropped: false,
      fileName: null,
    };
  },
  computed: {
    mode() {
      return this.contextParams && this.contextParams.mode || 2;
    },
    atomId() {
      return this.contextParams && this.contextParams.atomId || 0;
    },
    title() {
      if (this.mode === 1) return this.$text('Upload Image');
      else if (this.mode === 2) return this.$text('Upload File');
    },
    selectText() {
      if (this.mode === 1) return this.$text('Select Image');
      else if (this.mode === 2) return this.$text('Select File');
    },
    accept() {
      if (this.mode === 1) return 'image/*';
      else if (this.mode === 2) return '';
    },
  },
  mounted() {
    if (this.mode === 1) {
      this._cropper = new Cropper(this.$refs.image, {
        viewMode: 3,
        checkOrientation: false,
        autoCrop: false,
        movable: false,
        rotatable: false,
        scalable: false,
        zoomable: false,
        toggleDragModeOnDblclick: false,
        crop: () => {
          this.cropped = true;
        },
      });
    }
  },
  methods: {
    onClickSelect() {
      this.$refs.file.click();
    },
    onFileChange(event) {
      this.fileName = event.target.files[0].name;
      if (this.mode === 1) {
        const reader = new window.FileReader();
        reader.onload = () => {
          this._cropper.reset().replace(reader.result);
        };
        reader.readAsDataURL(event.target.files[0]);
      }
    },
    onClickClearCrop() {
      this._cropper.clear();
      this.cropped = false;
    },
    onPerformUpload() {
      const formData = new FormData();
      formData.append('mode', this.mode);
      formData.append('atomId', this.atomId);
      formData.append('file', this.$refs.file.files[0]);
      if (this.mode === 1) {
        formData.append('cropped', this.cropped);
        if (this.cropped) {
          const data = this._cropper.getData();
          for (const key in data) {
            data[key] = parseInt(data[key]);
          }
          formData.append('cropbox', JSON.stringify(data));
        }
      }
      return this.$api.post('file/upload', formData)
        .then(() => {
          // this.contextCallback(200, this.mode);
          // this.$f7router.back();
          return true;
        });
    },
  },
};

</script>
<style lang="less" scoped>
.image {
  max-width: 100%;
}

</style>
