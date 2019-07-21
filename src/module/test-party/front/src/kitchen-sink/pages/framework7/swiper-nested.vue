<template>
  <eb-page>
    <eb-navbar title="Nested Swipers" eb-back-link="Back"></eb-navbar>
    <div
      data-pagination="{'el': '.swiper-pagination-h'}"
      class="swiper-container swiper-init demo-swiper"
    >
      <div class="swiper-pagination swiper-pagination-h"></div>
      <div class="swiper-wrapper">
        <div class="swiper-slide">Horizontal Slide 1</div>
        <div class="swiper-slide">
          <div
            data-pagination="{'el': '.swiper-pagination-v'}"
            data-direction="vertical"
            class="swiper-container swiper-init demo-swiper"
          >
            <div class="swiper-pagination swiper-pagination-v"></div>
            <div class="swiper-wrapper">
              <div class="swiper-slide">Vertical Slide 1</div>
              <div class="swiper-slide">Vertical Slide 2</div>
              <div class="swiper-slide">Vertical Slide 3</div>
            </div>
          </div>
        </div>
        <div class="swiper-slide">Horizontal Slide 3</div>
        <div class="swiper-slide">Horizontal Slide 4</div>
      </div>
    </div>
  </eb-page>
</template>
<script>
export default {};
</script>
