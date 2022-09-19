import Vue from 'vue';
const ebPageContext = Vue.prototype.$meta.module.get('a-components').options.mixins.ebPageContext;

export default {
  mixins: [ebPageContext],
  data() {
    return {};
  },
  computed: {
    title() {
      return this.contextParams.title;
    },
    photos() {
      return this.contextParams.photos;
    },
    activeIndex() {
      return this.contextParams.activeIndex;
    },
  },
  mounted() {
    this._initActiveIndex();
  },
  methods: {
    _initActiveIndex() {
      if (this.activeIndex === undefined) return;
      const swiper = this.$f7.swiper.get(this.$refs.swiper.$el);
      swiper.slideTo(this.activeIndex, 0, false);
    },
    _renderPhotos() {
      if (!this.photos) return null;
      const domSlides = [];
      for (const photo of this.photos) {
        domSlides.push(
          <f7-swiper-slide key={photo.url}>
            <div class="caption">
              <span>{photo.caption}</span>
            </div>
            <img class="photo" src={photo.url} />
          </f7-swiper-slide>
        );
      }
      const params = {
        pagination: { clickable: true },
      };
      const single = this.photos.length === 1;
      // framework7 UI swiper
      return (
        <f7-swiper ref="swiper" class="eb-photo-browser" pagination={!single} navigation={!single} params={params}>
          {domSlides}
        </f7-swiper>
      );
    },
  },
  render() {
    return (
      <eb-page>
        <eb-navbar title={this.title} eb-back-link="Back"></eb-navbar>
        {this._renderPhotos()}
      </eb-page>
    );
  },
};
