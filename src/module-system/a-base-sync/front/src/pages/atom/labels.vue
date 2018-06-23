<template>
  <f7-page>
    <eb-navbar :title="$text('Labels')" eb-back-link="Back">
      <f7-nav-right>
        <eb-link iconMaterial="add" @click.prevent="onAddLabel"></eb-link>
      </f7-nav-right>
    </eb-navbar>
    <f7-list v-if="labelsAll">
      <f7-list-item group-title :title="item?item.atomName:''"></f7-list-item>
      <f7-list-item v-for="key of Object.keys(labelsAll)" :key="key" :title="labelsAll[key].text" checkbox :checked="labelChecked(key)" @change="onLabelCheckChange($event,key)" swipeout>
        <div slot="media" class="media" :style="{backgroundColor:labelsAll[key].color}"></div>
        <f7-swipeout-actions>
          <eb-swipeout-button close>{{$text('Close')}}</eb-swipeout-button>
          <eb-swipeout-button color="orange" :context="key" :onPerform="onEditLabel">{{$text('Edit')}}</eb-swipeout-button>
        </f7-swipeout-actions>
      </f7-list-item>
    </f7-list>
    <f7-sheet ref="ebSheet" fill :opened="sheetOpened" @sheet:closed="sheetOpened = false">
      <f7-toolbar>
        <div class="left">
          <f7-link sheet-close>{{$text('Close')}}</f7-link>
        </div>
        <div class="right">
          <eb-link :onPerform="onSubmit">{{$text('Submit')}}</eb-link>
        </div>
      </f7-toolbar>
      <f7-page-content>
        <div class="label">
          <f7-badge :style="{backgroundColor:labelColor}">{{labelText}}</f7-badge>
        </div>
        <f7-list form no-hairlines-md>
          <f7-list-item>
            <f7-label floating>{{$text('Text')}}</f7-label>
            <eb-input type="text" v-model="labelText" :placeholder="$text('Text')" clear-button></eb-input>
          </f7-list-item>
        </f7-list>
        <f7-block>
          <div class="row colors">
            <f7-button v-for="color of colors" :key="color.value" class="col-33" :style="{backgroundColor:color.value}" small fill @click="onColorSelect(color)">{{$text(color.name)}}</f7-button>
          </div>
        </f7-block>
      </f7-page-content>
    </f7-sheet>
  </f7-page>
</template>
<script>
export default {
  data() {
    return {
      atomId: parseInt(this.$f7Route.query.atomId),
      item: null,
      labels: [],
      sheetOpened: false,
      labelId: 0,
      labelText: '',
      labelColor: '',
      colors: [
        { name: 'Red', value: '#FC6360' },
        { name: 'Orange', value: '#FDA951' },
        { name: 'Yellow', value: '#FED558' },
        { name: 'Blue', value: '#54BEF7' },
        { name: 'Green', value: '#86DF6A' },
        { name: 'Purple', value: '#D592E5' },
      ],
    };
  },
  computed: {
    labelsAll() {
      return this.$local.state.labels;
    },
  },
  methods: {
    onAddLabel() {
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
    onSubmit() {
      if (!this.labelText || !this.labelColor) return;
      const labels = this.$utils.extend({}, this.labelsAll);
      if (this.labelId === 0) {
        labels[this.newLabelId()] = { text: this.labelText, color: this.labelColor };
      } else {
        labels[this.labelId] = { text: this.labelText, color: this.labelColor };
      }
      return this.$api.post('user/setLabels', {
        labels,
      }).then(() => {
        this.$local.commit('setLabels', labels);
        this.sheetOpened = false;
      });
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
      if (event.target.checked && index === -1) {
        this.labels.push(key);
      } else if (!event.target.checked && index > -1) {
        this.labels.splice(index, 1);
      }
      // sort
      this.labels.sort((a, b) => a - b);
      // post
      this.$api.post('atom/labels', {
        key: { atomId: this.atomId },
        atom: { labels: this.labels },
      }).then(() => {
        this.$meta.eventHub.$emit('atom:labels', { key: { atomId: this.atomId }, labels: this.labels });
      });
    },
  },
  created() {
    this.$local.dispatch('getLabels');
    this.$api.post('atom/read', {
      key: { atomId: this.atomId },
    }).then(data => {
      this.item = data;
      this.labels = JSON.parse(this.item.labels) || [];
    });
  },
};

</script>
<style scoped>
.label {
  position: absolute;
  width: 100%;
  top: 10px;
  text-align: center;
}

.media {
  width: 16px;
  height: 16px;
  border-radius: 8px;
}

.colors {
  height: 60px;
}

</style>
