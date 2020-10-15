<template>
  <div>
    {{this.layoutConfig}}
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
    layoutConfig: {
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
