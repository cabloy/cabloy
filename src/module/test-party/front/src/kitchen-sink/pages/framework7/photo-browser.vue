<template>
  <eb-page>
    <eb-navbar large largeTransparent :title="$text('Photo Browser')" eb-back-link="Back"></eb-navbar>
    <f7-block>
      <p>Photo Browser is a standalone and highly configurable component that allows to open window with photo viewer and navigation elements with the following features:</p>
      <ul>
        <li>Swiper between photos</li>
        <li>Multi-gestures support for zooming</li>
        <li>Toggle zoom by double tap on photo</li>
        <li>Single click on photo to toggle Exposition mode</li>
      </ul>
    </f7-block>
    <f7-block>
      <p>Photo Browser could be opened in a separate Page:</p>
      <f7-row>
        <f7-col>
          <f7-photo-browser :photos="photos" type="page" back-link-text="Back" ref="page"></f7-photo-browser>
          <f7-button fill @click="$refs.page.open()">Page</f7-button>
        </f7-col>
      </f7-row>
    </f7-block>
    <f7-block>
      <p>Photo Browser suppots 2 default themes - default Light (like in previous examples) and Dark theme. Here is a Dark theme examples:</p>
      <f7-row>
        <f7-col>
          <f7-photo-browser :photos="photos" theme="dark" type="page" back-link-text="Back" ref="pageDark"></f7-photo-browser>
          <f7-button fill @click="$refs.pageDark.open()">Page</f7-button>
        </f7-col>
      </f7-row>
    </f7-block>
  </eb-page>
</template>
<script>
import imgBeach from '../../../assets/img/beach.jpg';
import imgLock from '../../../assets/img/lock.jpg';
import imgMonkey from '../../../assets/img/monkey.jpg';
import imgMountains from '../../../assets/img/mountains.jpg';

export default {
  data() {
    return {
      photos: [{
          url: imgBeach,
          caption: 'Amazing beach in Goa, India',
        },
        'http://placekitten.com/1024/1024',
        imgLock,
        {
          url: imgMonkey,
          caption: 'I met this monkey in Chinese mountains',
        },
        {
          url: imgMountains,
          caption: 'Beautiful mountains in Zhangjiajie, China',
        },
      ],
    };
  },
};

</script>
