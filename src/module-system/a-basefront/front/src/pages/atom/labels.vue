<template>
  <eb-page>
    <eb-navbar large largeTransparent :title="page_title" eb-back-link="Back">
      <f7-nav-right>
        <eb-link iconF7="::add" :onPerform="onPerformAddLabel"></eb-link>
        <eb-link v-if="page_dirty" iconF7="::done" :onPerform="onPerformDone"></eb-link>
      </f7-nav-right>
    </eb-navbar>
    <f7-list class="label-edit-list" v-if="labelsAll">
      <f7-list-item group-title :title="item ? item.atomName : ''"></f7-list-item>
      <eb-list-item
        v-for="key of Object.keys(labelsAll)"
        :key="key"
        :title="labelsAll[key].text"
        checkbox
        :checked="labelChecked(key)"
        @change="onLabelCheckChange($event, key)"
        swipeout
      >
        <div slot="media" :class="`label-media bg-color-${labelsAll[key].color}`"></div>
        <eb-context-menu>
          <div slot="right">
            <div close color="orange" :context="key" :onPerform="onEditLabel">{{ $text('Edit') }}</div>
          </div>
        </eb-context-menu>
      </eb-list-item>
    </f7-list>
    <f7-sheet class="label-edit" ref="ebSheet" fill :opened="sheetOpened" @sheet:closed="sheetOpened = false">
      <f7-toolbar>
        <div class="left">
          <f7-link sheet-close>{{ $text('Close') }}</f7-link>
        </div>
        <div class="right">
          <eb-link ref="buttonSubmit" :onPerform="onPerformSubmit">{{ $text('Submit') }}</eb-link>
        </div>
      </f7-toolbar>
      <f7-page-content>
        <div class="label-prompt">
          <f7-badge :color="labelColor">{{ labelText || $text('PleaseInputText') }}</f7-badge>
        </div>
        <eb-list class="label-form" form inline-labels no-hairlines-md @submit="onFormSubmit">
          <eb-list-input
            :label="$text('Text')"
            type="text"
            clear-button
            :placeholder="$text('Text')"
            v-model="labelText"
          >
          </eb-list-input>
          <f7-list-item>
            <div class="row label-colors">
              <f7-button
                v-for="color of colors"
                :key="color.value"
                :class="`col-33 color-${color.value}`"
                small
                fill
                @click="onColorSelect(color)"
                >{{ $text(color.name) }}</f7-button
              >
            </div>
          </f7-list-item>
        </eb-list>
      </f7-page-content>
    </f7-sheet>
  </eb-page>
</template>
<script>
import Vue from 'vue';
const ebPageDirty = Vue.prototype.$meta.module.get('a-components').options.mixins.ebPageDirty;
export default {
  mixins: [ebPageDirty],
  data() {
    return {
      atomId: parseInt(this.$f7route.query.atomId),
      item: null,
      labels: [],
      sheetOpened: false,
      labelId: 0,
      labelText: '',
      labelColor: '',
      colors: [
        { name: 'Red', value: 'red' },
        { name: 'Orange', value: 'orange' },
        { name: 'Purple', value: 'purple' },
        { name: 'Yellow', value: 'yellow' },
        { name: 'Blue', value: 'blue' },
        { name: 'Green', value: 'green' },
      ],
    };
  },
  computed: {
    page_title() {
      return this.page_getDirtyTitle(this.$text('UserLabels'));
    },
    labelsAll() {
      return this.$store.getters['a/base/userLabels'];
    },
  },
  created() {
    this.init();
  },
  methods: {
    async init() {
      await this.$store.dispatch('a/base/getLabels');
      this.item = await this.$api.post('/a/base/atom/read', {
        key: { atomId: this.atomId },
      });
      this.labels = JSON.parse(this.item.labels) || [];
    },
    async onPerformDone() {
      // sort
      this.labels.sort((a, b) => a - b);
      // post
      await this.$api.post('/a/base/atom/labels', {
        key: { atomId: this.atomId },
        atom: { labels: this.labels },
      });
      this.$meta.eventHub.$emit('atom:labels', { key: { atomId: this.atomId }, labels: this.labels });
      // close
      this.page_setDirty(false);
      this.$f7router.back();
    },
    onPerformAddLabel() {
      this.labelId = 0;
      this.labelText = '';
      this.labelColor = '';
      this.sheetOpened = true;
    },
    onEditLabel(event, key) {
      this.labelId = key;
      this.labelText = this.labelsAll[key].text;
      this.labelColor = this.labelsAll[key].color;
      this.sheetOpened = true;
    },
    onFormSubmit() {
      this.$refs.buttonSubmit.onClick();
    },
    async onPerformSubmit() {
      if (!this.labelText || !this.labelColor) return;
      const labels = this.$meta.util.extend({}, this.labelsAll);
      if (this.labelId === 0) {
        labels[this.newLabelId()] = { text: this.labelText, color: this.labelColor };
      } else {
        labels[this.labelId] = { text: this.labelText, color: this.labelColor };
      }
      await this.$api.post('/a/base/user/setLabels', {
        labels,
      });
      this.$store.commit('a/base/setLabels', labels);
      this.sheetOpened = false;
    },
    onColorSelect(color) {
      this.labelColor = color.value;
    },
    newLabelId() {
      const keys = Object.keys(this.labelsAll);
      if (keys.length === 0) return 1;
      keys.sort((a, b) => b - a);
      return parseInt(keys[0]) + 1;
    },
    labelChecked(key) {
      return this.labels && this.labels.indexOf(key) > -1;
    },
    onLabelCheckChange(event, key) {
      // labels
      const index = this.labels.indexOf(key);
      if (event.currentTarget.checked && index === -1) {
        this.labels.push(key);
        this.page_setDirty(true);
      } else if (!event.currentTarget.checked && index > -1) {
        this.labels.splice(index, 1);
        this.page_setDirty(true);
      }
    },
  },
};
</script>
<style lang="less" scoped>
.label-edit-list {
  .label-media {
    width: 16px;
    height: 16px;
    border-radius: 8px;
  }
}

.label-edit {
  .label-prompt {
    position: absolute;
    width: 100%;
    top: 10px;
    text-align: center;
  }

  .label-form {
    margin-top: 40px;
  }

  .label-colors {
    height: 60px;
    width: 100%;
  }
}
</style>
