<template>
  <eb-page>
    <eb-navbar :title="$text('test')" eb-back-link="Back"></eb-navbar>
    <f7-button @click="onClick">test</f7-button>
  </eb-page>
</template>
<script>
export default {
  data() {
    return {};
  },
  methods: {
    onClick() {
      this.$view.navigate('/a/file/file/upload', {
        context: {
          params: {
            mode: 1,
            atomId: 1,
          },
          callback: (code, data) => {
            if (code === 200) {
              console.log(data);
            }
          },
        },
      });
    },
  },
};

</script>
