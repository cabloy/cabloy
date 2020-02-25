<template>
  <eb-page>
    <eb-navbar large largeTransparent :title="$text('Built-in Theme')" eb-back-link="Back"></eb-navbar>
    <template v-if="builtIn">
      <f7-block-title medium>{{$text('Layout Themes')}}</f7-block-title>
      <f7-block strong>
        <f7-row>
          <f7-col width="50" class="bg-color-white demo-theme-picker" @click="setLayoutTheme('light')">
            <f7-checkbox checked disabled v-if="builtIn.layout === 'light'" />
          </f7-col>
          <f7-col width="50" class="bg-color-black demo-theme-picker" @click="setLayoutTheme('dark')">
            <f7-checkbox checked disabled v-if="builtIn.layout === 'dark'" />
          </f7-col>
        </f7-row>
      </f7-block>
      <f7-block-title medium>{{$text('Navigation Bars Style')}}</f7-block-title>
      <f7-block strong>
        <f7-row>
          <f7-col width="50" class="demo-bars-picker demo-bars-picker-empty" @click="setBarsStyle('empty')">
            <div class="demo-navbar"></div>
            <f7-checkbox checked disabled v-if="builtIn.bars === 'empty'" />
          </f7-col>
          <f7-col width="50" class="demo-bars-picker demo-bars-picker-fill" @click="setBarsStyle('fill')">
            <div class="demo-navbar"></div>
            <f7-checkbox checked disabled v-if="builtIn.bars === 'fill'" />
          </f7-col>
        </f7-row>
      </f7-block>
      <f7-block-title medium>{{$text('Color Themes')}}</f7-block-title>
      <f7-block strong>
        <f7-row>
          <f7-col width="33" v-for="(color, index) in colors" :key="index">
            <f7-button fill round small class="demo-color-picker-button" :color="color.toLowerCase()" @click="setColorTheme(color.toLowerCase())">{{$text(color)}}</f7-button>
          </f7-col>
          <f7-col width="33" />
          <f7-col width="33" />
        </f7-row>
      </f7-block>
      <f7-block-title medium>{{$text('Custom Color Theme')}}</f7-block-title>
      <f7-list>
        <f7-list-input type="colorpicker" :label="$text('HEX Color')" :placeholder="`${$text('e.g.')} #ff0000`" readonly :value="{hex: builtIn.customColor || themeColor}" :color-picker-params="{
          targetEl: '#color-theme-picker-color',
        }" @colorpicker:change="value => setCustomColor(value.hex)">
          <div slot="media" id="color-theme-picker-color" style="width: 28px; height: 28px; border-radius: 4px; background: var(--f7-theme-color)"></div>
        </f7-list-input>
      </f7-list>
    </template>
  </eb-page>
</template>
<script>
var colors = [
  'Red',
  'Green',
  'Blue',
  'Pink',
  'Yellow',
  'Orange',
  'Purple',
  'Deeppurple',
  'Lightblue',
  'Teal',
  'Lime',
  'Deeporange',
  'Gray',
  'Black',
];
import Vue from 'vue';
const ebPageContext = Vue.prototype.$meta.module.get('a-components').options.components.ebPageContext;
export default {
  mixins: [ebPageContext],
  data() {
    return {
      builtIn: null,
      themeColor: this.$$('html').css('--f7-theme-color').trim(),
      colors,
    };
  },
  computed: {
    loggedIn() {
      return this.$store.state.auth.loggedIn;
    },
    user() {
      return this.$store.state.auth.user;
    },
  },
  mounted() {
    // pageContext
    const contextParams = this.contextParams;
    // builtIn
    this.builtIn = contextParams.builtIn;
  },
  methods: {
    change() {
      // pageContext
      const contextParams = this.contextParams;
      if (contextParams.onChange) {
        contextParams.onChange(this.builtIn);
      }
    },
    setLayoutTheme(layout) {
      this.builtIn.layout = layout;
      this.change();
    },
    setBarsStyle(bars) {
      this.builtIn.bars = bars;
      this.change();
    },
    setColorTheme(color) {
      this.builtIn.color = color;
      this.builtIn.customColor = null;
      this.themeColor = this.$$('html').css('--f7-color-' + color).trim();
      this.change();
    },
    setCustomColor(color) {
      this.builtIn.customColor = color;
      this.change();
    },
  },
};

</script>
<style lang="less" scoped>
</style>
