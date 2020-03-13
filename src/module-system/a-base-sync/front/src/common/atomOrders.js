export default {
  computed: {
    ordersAll() {
      return this.$store.getState('a/base/orders');
    },
  },
  methods: {
    getOrdersOfAtomClass(atomClass) {
      if (!atomClass || !this.ordersAll) return null;
      return this.ordersAll[atomClass.module][atomClass.atomClassName];
    },
    getOrdersOfBase() {
      if (!this.ordersAll) return null;
      return this.ordersAll.base;
    },
  },
  created() {
    this.$store.dispatch('a/base/getOrders');
  },
};
