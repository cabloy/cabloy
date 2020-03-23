<template>
  <eb-button class="captcha" :disabled="buttonDisabled" :onPerform="onPerformSend">{{getSendText()}}</eb-button>
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
    context: {
      type: Object,
    },
    providerInstance: {
      type: Object,
    },
  },
  data() {
    return {
      sendTimer: 0,
      sendTimerCounter: 0,
    };
  },
  computed: {
    buttonDisabled() {
      return !!this.sendTimer || !this.context.mobile;
    },
  },
  created() {},
  methods: {
    onPerformSend() {
      if (this.sendTimer) return;
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
          if (--this.sendTimerCounter === 0) {
            this._setTimer(false);
          }
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
