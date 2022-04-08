import userItemBase from '../../components/user/userItemBase.js';
import resourcesSpreads from '../../components/resourceRight/spreads.vue';
export default {
  mixins: [userItemBase],
  components: {
    resourcesSpreads,
  },
  data() {
    return {};
  },
  methods: {
    page_onRefresh(done) {
      done();
      this.$refs.resourcesSpreads.reload();
    },
    page_onInfinite() {
      this.$refs.resourcesSpreads.loadMore();
    },
    onPerformAdd() {
      return this.$refs.resourcesSpreads.onPerformAdd();
    },
  },
  render() {
    let domSpreads;
    if (this.user) {
      domSpreads = <resources-spreads ref="resourcesSpreads" user={this.user} autoInit={true}></resources-spreads>;
    }
    return (
      <eb-page
        ptr
        onPtrRefresh={this.page_onRefresh}
        infinite
        infinitePreloader={false}
        onInfinite={this.page_onInfinite}
      >
        <eb-navbar
          large
          largeTransparent
          title={this.getPageTitle('Resource Authorizations')}
          eb-back-link="Back"
        ></eb-navbar>
        {domSpreads}
      </eb-page>
    );
  },
};
