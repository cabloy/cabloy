<template>
  <eb-page>
    <eb-navbar title="Space Between Slides" eb-back-link="Back"></eb-navbar>
    <div
      data-pagination="{'el': '.swiper-pagination', 'hideOnClick': true}"
      data-space-between="50"
      class="swiper-container swiper-init demo-swiper"
    >
      <div class="swiper-pagination"></div>
      <div class="swiper-wrapper">
        <div class="swiper-slide">Slide 1</div>
        <div class="swiper-slide">Slide 2</div>
        <div class="swiper-slide">Slide 3</div>
        <div class="swiper-slide">Slide 4</div>
        <div class="swiper-slide">Slide 5</div>
        <div class="swiper-slide">Slide 6</div>
        <div class="swiper-slide">Slide 7</div>
        <div class="swiper-slide">Slide 8</div>
        <div class="swiper-slide">Slide 9</div>
        <div class="swiper-slide">Slide 10</div>
      </div>
    </div>
  </eb-page>
</template>
<script>
export default {};
</script>
