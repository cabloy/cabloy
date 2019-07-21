<template>
  <eb-page>
    <eb-navbar title="Zoom" eb-back-link="Back"></eb-navbar>
    <div
      data-pagination="{'el': '.swiper-pagination'}"
      data-zoom="{'enabled': true}"
      data-navigation="{'nextEl': '.swiper-button-next', 'prevEl': '.swiper-button-prev'}"
      class="swiper-container swiper-init demo-swiper"
    >
      <div class="swiper-wrapper">
        <div class="swiper-slide">
          <div class="swiper-zoom-container">
            <img src="https://cdn.framework7.io/placeholder/nature-800x800-1.jpg" />
          </div>
        </div>
        <div class="swiper-slide">
          <div class="swiper-zoom-container">
            <img src="https://cdn.framework7.io/placeholder/nature-800x800-2.jpg" />
          </div>
        </div>
        <div class="swiper-slide">
          <div class="swiper-zoom-container">
            <img src="https://cdn.framework7.io/placeholder/nature-800x800-3.jpg" />
          </div>
        </div>
        <div class="swiper-slide">
          <div class="swiper-zoom-container">
            <img src="https://cdn.framework7.io/placeholder/nature-800x800-4.jpg" />
          </div>
        </div>
        <div class="swiper-slide">
          <div class="swiper-zoom-container">
            <img src="https://cdn.framework7.io/placeholder/nature-800x800-5.jpg" />
          </div>
        </div>
        <div class="swiper-slide">
          <div class="swiper-zoom-container">
            <img src="https://cdn.framework7.io/placeholder/nature-800x800-6.jpg" />
          </div>
        </div>
      </div>
      <div class="swiper-button-next"></div>
      <div class="swiper-button-prev"></div>
      <div class="swiper-pagination"></div>
    </div>
  </eb-page>
</template>
<script>
export default {};
</script>
