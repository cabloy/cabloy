<template>
  <eb-page>
    <eb-navbar :title="title" eb-back-link="Back"></eb-navbar>
    <eb-box ref="box" @size="onSize">
      <img ref="image" class="image">
    </eb-box>
    <input ref="file" type="file" :accept="accept" @change="onFileChange" style="display: none;" />
    <div v-if="fileName" class="fileName">{{fileName}}</div>
    <f7-toolbar bottom-md>
      <f7-button @click="onClickSelect">{{selectText}}</f7-button>
      <f7-button v-if="cropped" @click="onClickClearCrop">{{$text('Clear Crop')}}</f7-button>
      <eb-button v-if="fileName" active :onPerform="onPerformUpload">{{$text('Upload')}}</eb-button>
    </f7-toolbar>
  </eb-page>
</template>
<script>
import Vue from 'vue';
import Cropper from 'cropperjs';
const ebPageContext = Vue.prototype.$meta.module.get('a-components').options.components.ebPageContext;
export default {
  mixins: [ebPageContext],
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
    attachment() {
      return this.contextParams && this.contextParams.attachment || 0;
    },
    flag() {
      return this.contextParams && this.contextParams.flag || '';
    },
    title() {
      if (this.mode === 1) return this.$text('Upload Image');
      else if (this.mode === 2) return this.$text('Upload File');
      else if (this.mode === 3) return this.$text('Upload Audio');
    },
    selectText() {
      if (this.mode === 1) return this.$text('Select Image');
      else if (this.mode === 2) return this.$text('Select File');
      else if (this.mode === 3) return this.$text('Select Audio');
    },
    accept() {
      const custom = this.contextParams && this.contextParams.accept;
      if (this.mode === 1) return custom || 'image/*';
      else if (this.mode === 2) return custom || '';
      else if (this.mode === 3) return custom || 'audio/*';
    },
  },
  mounted() {},
  methods: {
    createCropper() {
      if (this.mode === 1) {
        this._cropper = new Cropper(this.$refs.image, {
          viewMode: 2,
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
    onSize(size) {
      this.$$(this.$refs.box.$el).css({
        height: `${size.height - 40}px`,
      });
      this.createCropper();
    },
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
      const formData = new window.FormData();
      formData.append('mode', this.mode);
      formData.append('atomId', this.atomId);
      formData.append('attachment', this.attachment);
      formData.append('flag', this.flag);
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
      formData.append('file', this.$refs.file.files[0]);
      return this.$api.post('file/upload', formData)
        .then(data => {
          this.contextCallback(200, data);
          this.$f7router.back();
        });
    },
  },
};

</script>
<style lang="less" scoped>
.image {
  max-width: 100%;
}

.fileName {
  text-align: center;
  color: #fff;
  padding: 20px 20px;
  background: #555;
  opacity: 0.4;
  user-select: none;
}

</style>
