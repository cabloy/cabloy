require.config({
  paths: {
    Swiper: 'api/static/a/swiper/vendor/swiper/8.4.5/swiper-bundle.min',
    Swiper_CSS: 'api/static/a/swiper/vendor/swiper/8.4.5/swiper-bundle.min',
  },
});
define(['Swiper', 'css!Swiper_CSS'], function (Swiper) {
  return Swiper;
});
