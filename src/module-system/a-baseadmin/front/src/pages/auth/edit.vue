<template>
  <f7-page>
    <eb-navbar :title="$text('Edit')" eb-back-link="Back">
      <f7-nav-right>
        <eb-link iconMaterial="save" :onPerform="onPerformSave"></eb-link>
      </f7-nav-right>
    </eb-navbar>
    <f7-block>
      <eb-validate ref="validate" auto :data="config" :params="{validator: 'auth'}" :onPerform="onPerformValidate">
      </eb-validate>
    </f7-block>
  </f7-page>
</template>
<script>
export default {
  meta: {
    global: false,
  },
  data() {
    return {
      id: parseInt(this.$f7Route.query.id),
      item: null,
      config: null,
    }
  },
  created() {
    this.$api.post('auth/item', { id: this.id }).then(data => {
      this.item = data;
      this.config = JSON.parse(data.config);
    })
  },
  methods: {
    onPerformValidate() {
      return this.$api.post('auth/save', {
        id: this.id,
        data: this.config,
      }).then(() => {
        this.$f7Router.back();
      });
    },
    onPerformSave() {
      return this.$refs.validate.perform();
    },
  },
};

</script>
<style scoped>


</style>
