<template>
  <div>
    {{this.layoutManager.atomClass}}
  </div>
</template>
<script>
export default {
  meta: {
    global: false,
  },
  props: {
    layoutManager: {
      type: Object,
    },
  },
  data() {
    return {
    };
  },
  created() {
  },
  methods: {
  },
};

</script>
