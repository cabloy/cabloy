<template>
  <img :src="src" @click="onClick" class="captcha" crossorigin="use-credentials"></img>
</template>
<script>
export default {
  meta: {
    global: false,
  },
  props: {
    module: {
      type: String,
    },
    sceneName: {
      type: String,
    },
    context: {},
    providerInstance: {
      type: Object,
    },
  },
  data() {
    return {
      src: null,
    };
  },
  created() {
    this.changeSrc();
  },
  methods: {
    changeSrc() {
      if (this.$meta.config.base.jwt) {
        this.$api.post('/a/base/jwt/create').then(res => {
          this._setSrc(res.jwt);
        });
      } else {
        this._setSrc(null);
      }
    },
    _setSrc(jwt) {
      const url = this.$meta.util.combineFetchPath('a-captchasimple', 'captcha/image');
      const query = {
        providerInstanceId: this.providerInstance.providerInstanceId,
        t: Math.random(),
      };
      if (jwt) {
        query['eb-jwt'] = jwt;
      }
      this.src = this.$meta.util.combineQueries(url, query);
    },
    onClick() {
      this.changeSrc();
    },
  },
};

</script>
<style scoped>
.captcha {
  height: 48px;
  cursor: pointer;
}

</style>
