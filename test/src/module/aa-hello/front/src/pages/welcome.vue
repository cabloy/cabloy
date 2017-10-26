<template>
  <f7-page>
    <f7-navbar title="Welcome" back-link="Back" sliding></f7-navbar>
    <f7-block inner>
      <p class="welcome">{{who}} are welcome!</p>
      <p class="welcome">{{message}}</p>
      <div class="picture"><img src="../../static/img/img.jpg"></div>
    </f7-block>
  </f7-page>
</template>
<script>
export default {
  computed: {
    who() {
      return this.$route.params.who;
    },
    message() {
      return this.$local.getters('message2');
    },
  },
  created() {
    this.$local.dispatch('setMessage', this)
      .then(() => {
        console.log(this.$local.getters('message2'));
      })
      .catch(err => { console.log(err); });
  },
};

</script>
<style>
.picture,
.welcome {
  text-align: center;
}

.picture img {
  width: 95%;
  max-width: 300px;
  border-radius: 10px;
}

</style>
