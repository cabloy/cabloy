<template>
  <eb-link class="captcha" :onPerform="onPerformSend">{{getSendText()}}</eb-link>
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
      sendTimer: 0,
      sendTimerCounter: 0,
    };
  },
  created() {
    this.changeSrc();
  },
  methods: {
    onPerformSend() {
      return this.$api.post('captcha/sendCode', {
        providerInstanceId: this.providerInstance.providerInstanceId,
        context: this.context,
      }).then(() => {
        this._setTimer(true);
      });
    },
    getSendText() {
      return this.sendTimer ? this.$text('Resend in %ds', this.sendTimerCounter) : this.$text('Send Code');
    },
    _setTimer(_set) {
      if (_set) {
        this._setTimer(false);
        this.sendTimerCounter = this.$config.sendCode.counter;
        this.sendTimer = window.setInterval(() => {
          this.sendTimerCounter--;
        }, 1000);
      } else {
        if (this.sendTimer) {
          window.clearInterval(this.sendTimer);
          this.sendTimer = 0;
        }
      }
    },
  },
};

</script>
<style scoped>
.captcha {
  white-space: nowrap;
}

</style>
