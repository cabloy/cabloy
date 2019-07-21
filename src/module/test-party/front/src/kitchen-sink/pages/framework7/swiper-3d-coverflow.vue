<template>
  <eb-page>
    <eb-navbar title="3D Coverflow Effect" eb-back-link="Back"></eb-navbar>
    <div
      data-pagination="{'el': '.swiper-pagination'}"
      data-effect="coverflow"
      data-slides-per-view="auto"
      data-centered-slides="true"
      class="swiper-container swiper-init demo-swiper demo-swiper-coverflow"
    >
      <div class="swiper-pagination"></div>
      <div class="swiper-wrapper">
        <div
          style="background-image:url(https://cdn.framework7.io/placeholder/nature-800x800-1.jpg)"
          class="swiper-slide"
        >Slide 1</div>
        <div
          style="background-image:url(https://cdn.framework7.io/placeholder/nature-800x800-2.jpg)"
          class="swiper-slide"
        >Slide 2</div>
        <div
          style="background-image:url(https://cdn.framework7.io/placeholder/nature-800x800-3.jpg)"
          class="swiper-slide"
        >Slide 3</div>
        <div
          style="background-image:url(https://cdn.framework7.io/placeholder/nature-800x800-4.jpg)"
          class="swiper-slide"
        >Slide 4</div>
        <div
          style="background-image:url(https://cdn.framework7.io/placeholder/nature-800x800-5.jpg)"
          class="swiper-slide"
        >Slide 5</div>
        <div
          style="background-image:url(https://cdn.framework7.io/placeholder/nature-800x800-6.jpg)"
          class="swiper-slide"
        >Slide 6</div>
        <div
          style="background-image:url(https://cdn.framework7.io/placeholder/nature-800x800-7.jpg)"
          class="swiper-slide"
        >Slide 7</div>
        <div
          style="background-image:url(https://cdn.framework7.io/placeholder/nature-800x800-8.jpg)"
          class="swiper-slide"
        >Slide 8</div>
        <div
          style="background-image:url(https://cdn.framework7.io/placeholder/nature-800x800-9.jpg)"
          class="swiper-slide"
        >Slide 9</div>
      </div>
    </div>
  </eb-page>
</template>
<script>
export default {};
</script>
