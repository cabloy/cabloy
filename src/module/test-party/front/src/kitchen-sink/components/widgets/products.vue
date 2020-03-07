<template>
  <div class="data-table card">
    <table>
      <thead>
        <tr>
          <th class="label-cell">Time</th>
          <th class="numeric-cell">Calories</th>
          ...
          <th class="medium-only">Comment</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td class="label-cell">Frozen yogurt</td>
          <td class="numeric-cell">159</td>
          ...
          <td class="medium-only">I like it!</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script>
export default {
  meta: {
    global: false,
  },
  data() {
    return {};
  },
  methods: {
    signIn() {
      const info = this.$module.info;
      const url = `/api/${info.url}/passport/${info.relativeName}/authgithub`;
      this.$meta.vueApp.toLogin({ url });
    },
  },
};

</script>
<style scoped>
</style>
