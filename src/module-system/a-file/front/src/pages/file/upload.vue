<template>
  <eb-page>
    <eb-navbar :title="title" eb-back-link="Back"></eb-navbar>
    <eb-box
      @size="onSize"
      toolbar
      @dragover.native="onFileDragover"
      @dragenter.native="onFileDragenter"
      @dragleave.native="onFileDragleave"
      @drop.native="onFileDrop"
    >
      <img ref="image" class="image" />
    </eb-box>
    <input ref="file" type="file" :accept="accept" @change="onFileChange" style="display: none" />
    <div
      v-if="fileNameTip"
      class="fileName"
      @dragover="onFileDragover"
      @dragenter="onFileDragenter"
      @dragleave="onFileDragleave"
      @drop="onFileDrop"
    >
      {{ fileNameTip }}
    </div>
    <f7-toolbar bottom-md>
      <f7-button @click="onClickSelect">{{ selectText }}</f7-button>
      <f7-button v-if="cropped" @click="onClickClearCrop">{{ $text('Clear Crop') }}</f7-button>
      <eb-button v-if="fileBlob" active :onPerform="onPerformUpload">{{ $text('Upload') }}</eb-button>
    </f7-toolbar>
  </eb-page>
</template>
<script>
import Vue from 'vue';
import Cropper from 'cropperjs';
const ebPageContext = Vue.prototype.$meta.module.get('a-components').options.mixins.ebPageContext;
export default {
  mixins: [ebPageContext],
  data() {
    return {
      cropped: false,
      fileName: null,
      fileBlob: null,
      fileNameDragging: false,
    };
  },
  computed: {
    mode() {
      return (this.contextParams && this.contextParams.mode) || 2;
    },
    atomId() {
      return (this.contextParams && this.contextParams.atomId) || 0;
    },
    attachment() {
      return (this.contextParams && this.contextParams.attachment) || 0;
    },
    flag() {
      return (this.contextParams && this.contextParams.flag) || '';
    },
    fixed() {
      return this.contextParams && this.contextParams.fixed;
    },
    title() {
      if (this.mode === 1) return this.$text('Upload Image');
      else if (this.mode === 2) return this.$text('Upload File');
      else if (this.mode === 3) return this.$text('Upload Audio');
      return 'Not Support';
    },
    selectText() {
      if (this.mode === 1) return this.$text('Select Image');
      else if (this.mode === 2) return this.$text('Select File');
      else if (this.mode === 3) return this.$text('Select Audio');
      return 'Not Support';
    },
    accept() {
      const custom = this.contextParams && this.contextParams.accept;
      if (this.mode === 1) return custom || 'image/*';
      else if (this.mode === 2) return custom || '';
      else if (this.mode === 3) return custom || 'audio/*';
      return 'Not Support';
    },
    fileNameTip() {
      if (!this.fileName) return this.$text('UploadFileDragTip');
      return this.mode === 1 && !this.$config.upload.showFileName ? null : this.fileName;
    },
  },
  mounted() {},
  methods: {
    createCropper() {
      if (this.mode === 1) {
        const autoCrop = !!this.fixed;
        const options = {
          viewMode: 2,
          checkOrientation: false,
          autoCrop,
          movable: false,
          rotatable: false,
          scalable: false,
          zoomable: false,
          toggleDragModeOnDblclick: false,
          crop: () => {
            this.cropped = true;
          },
          ready: () => {},
        };
        if (this.fixed && this.fixed.width && this.fixed.height) {
          options.aspectRatio = this.fixed.width / this.fixed.height;
        }
        // new cropper
        this._cropper = new Cropper(this.$refs.image, options);
      }
    },
    onSize() {
      this.createCropper();
    },
    onClickSelect() {
      this.$refs.file.click();
    },
    onFileChange(event) {
      this.__setFile(event, event.currentTarget.files[0]);
    },
    __checkFileType(file) {
      const type = file.type;
      if (this.mode === 1 && type.indexOf('image/') !== 0) return false;
      if (this.mode === 3 && type.indexOf('audio/') !== 0) return false;
      return true;
    },
    __setFile(event, file) {
      if (!file) return;
      // check
      if (!this.__checkFileType(file)) {
        this.$view.toast.show({ text: this.$text('InvalidFileFormat') });
        return;
      }
      // set
      this.fileBlob = file;
      this.fileName = file.name;
      event.currentTarget.value = '';
      if (this.mode === 1) {
        const reader = new window.FileReader();
        reader.onload = () => {
          this._cropper.reset().replace(reader.result);
        };
        reader.readAsDataURL(this.fileBlob);
      }
    },
    onFileDragover(event) {
      event.preventDefault();
      event.stopPropagation();
    },
    onFileDragenter(event) {
      event.preventDefault();
      event.stopPropagation();
      const $target = this.$$(event.currentTarget);
      $target.addClass('fileDropPrompt');
    },
    onFileDragleave(event) {
      event.preventDefault();
      event.stopPropagation();
      const $target = this.$$(event.currentTarget);
      $target.removeClass('fileDropPrompt');
    },
    onFileDrop(event) {
      event.preventDefault();
      event.stopPropagation();
      const $target = this.$$(event.currentTarget);
      $target.removeClass('fileDropPrompt');
      this.__setFile(event, event.dataTransfer.files[0]);
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
        if (this.fixed) {
          formData.append('fixed', JSON.stringify(this.fixed));
        }
      }
      formData.append('file', this.fileBlob);
      return this.$api.post('file/upload', formData).then(data => {
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
  color: var(--f7-text-editor-button-text-color);
  padding: 20px 20px;
  background: var(--f7-text-editor-toolbar-bg-color);
  opacity: 0.6;
  user-select: none;
}

.fileDropPrompt {
  background: hsla(0, 0%, 60%, 0.32);
}
</style>
