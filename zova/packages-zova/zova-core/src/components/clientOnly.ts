import { defineComponent, onMounted, ref } from 'vue';

export const ClientOnly = defineComponent({
  name: 'ClientOnly',
  inheritAttrs: true,
  setup(_props, { slots }) {
    const isMounted = ref(false);
    onMounted(() => {
      isMounted.value = true;
    });
    return () => {
      if (isMounted.value === false) {
        return slots.placeholder?.();
      } else {
        return slots.default?.();
      }
    };
  },
});
