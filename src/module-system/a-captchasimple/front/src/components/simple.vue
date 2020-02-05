<template>
  <img :src="src" @click="onClick" class="captcha" crossorigin="use-credentials"></img>
</template>
<script>
export default {
  meta: {
    global: false,
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
      this.src = this.$meta.util.combineFetchPath('a-captchasimple', `simple/getCaptcha?t=${Math.random()}`);
    },
    onClick() {
      this.changeSrc();
    },
  },
};

</script>
<style scoped>
.captcha {
  cursor: pointer;
}

</style>
