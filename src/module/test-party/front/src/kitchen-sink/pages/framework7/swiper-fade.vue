<template>
  <eb-page>
    <eb-navbar title="Fade Effect" eb-back-link="Back"></eb-navbar>
    <div data-pagination='{"el": ".swiper-pagination"}' data-effect="fade" class="swiper-container swiper-init demo-swiper demo-swiper-fade">
      <div class="swiper-pagination"></div>
      <div class="swiper-wrapper">
        <div style="background-image:url(https://cdn.framework7.io/placeholder/people-1024x1024-1.jpg)" class="swiper-slide"></div>
        <div style="background-image:url(https://cdn.framework7.io/placeholder/people-1024x1024-2.jpg)" class="swiper-slide"></div>
        <div style="background-image:url(https://cdn.framework7.io/placeholder/people-1024x1024-3.jpg)" class="swiper-slide"></div>
        <div style="background-image:url(https://cdn.framework7.io/placeholder/people-1024x1024-4.jpg)" class="swiper-slide"></div>
      </div>
    </div>
  </eb-page>
</template>
<script>
export default {};

</script>
