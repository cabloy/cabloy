<template>
  <eb-page>
    <eb-navbar :title="$text('Instance')" eb-back-link="Back">
      <f7-nav-right>
        <eb-link iconMaterial="save" :onPerform="onPerformSave"></eb-link>
      </f7-nav-right>
    </eb-navbar>
    <eb-validate ref="validate" auto :data="instance" :params="{validator: 'instance'}" :onPerform="onPerformValidate">
    </eb-validate>
  </eb-page>
</template>
<script>
export default {
  data() {
    return {
      instance: null,
    };
  },
  created() {
    this.$api.post('instance/item').then(data => {
      data.config = JSON.stringify(JSON.parse(data.config || '{}'), null, 2);
      this.instance = data;
    });
  },
  methods: {
    onPerformValidate() {
      return this.$api.post('instance/save', {
        data: this.instance,
      }).then(() => {
        // instance
        this.$store.commit('auth/setInstance', { name: this.instance.name, title: this.instance.title });
        // title
        window.document.title = this.$store.getters['auth/title'];
        // back
        this.$f7router.back();
      });
    },
    onPerformSave() {
      return this.$refs.validate.perform();
    },
  },
};

</script>
