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
          modules: ['initial-current-colors', 'sb-spectrum', 'rgb-sliders', 'hex', 'palette'],
          openIn: 'auto',
          sliderValue: true,
          sliderValueEditable: true,
          sliderLabel: true,
          hexLabel: true,
          hexValueEditable: true,
          groupedModules: true,
          palette: [
            ['#FFEBEE', '#FFCDD2', '#EF9A9A', '#E57373', '#EF5350', '#F44336', '#E53935', '#D32F2F', '#C62828', '#B71C1C'],
            ['#F3E5F5', '#E1BEE7', '#CE93D8', '#BA68C8', '#AB47BC', '#9C27B0', '#8E24AA', '#7B1FA2', '#6A1B9A', '#4A148C'],
            ['#E8EAF6', '#C5CAE9', '#9FA8DA', '#7986CB', '#5C6BC0', '#3F51B5', '#3949AB', '#303F9F', '#283593', '#1A237E'],
            ['#E1F5FE', '#B3E5FC', '#81D4FA', '#4FC3F7', '#29B6F6', '#03A9F4', '#039BE5', '#0288D1', '#0277BD', '#01579B'],
            ['#E0F2F1', '#B2DFDB', '#80CBC4', '#4DB6AC', '#26A69A', '#009688', '#00897B', '#00796B', '#00695C', '#004D40'],
            ['#F1F8E9', '#DCEDC8', '#C5E1A5', '#AED581', '#9CCC65', '#8BC34A', '#7CB342', '#689F38', '#558B2F', '#33691E'],
            ['#FFFDE7', '#FFF9C4', '#FFF59D', '#FFF176', '#FFEE58', '#FFEB3B', '#FDD835', '#FBC02D', '#F9A825', '#F57F17'],
            ['#FFF3E0', '#FFE0B2', '#FFCC80', '#FFB74D', '#FFA726', '#FF9800', '#FB8C00', '#F57C00', '#EF6C00', '#E65100'],
          ],
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
