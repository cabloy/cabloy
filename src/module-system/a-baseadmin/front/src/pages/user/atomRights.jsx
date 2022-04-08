import userItemBase from '../../components/user/userItemBase.js';
import atomsSpreads from '../../components/atomRight/spreads.vue';
export default {
  mixins: [userItemBase],
  components: {
    atomsSpreads,
  },
  data() {
    return {};
  },
  methods: {
    page_onRefresh(done) {
      done();
      this.$refs.atomsSpreads.reload();
    },
    page_onInfinite() {
      this.$refs.atomsSpreads.loadMore();
    },
    onPerformAdd() {
      return this.$refs.atomsSpreads.onPerformAdd();
    },
  },
  render() {
    let domSpreads;
    if (this.user) {
      domSpreads = <atoms-spreads ref="atomsSpreads" user={this.user} autoInit={true}></atoms-spreads>;
    }
    return (
      <eb-page
        ptr
        onPtrRefresh={this.page_onRefresh}
        infinite
        infinitePreloader={false}
        onInfinite={this.page_onInfinite}
      >
        <eb-navbar large largeTransparent title={this.getPageTitle('Atom Authorization')} eb-back-link="Back">
          <f7-nav-right>
            <eb-link iconF7="::add" propsOnPerform={this.onPerformAdd}></eb-link>
          </f7-nav-right>
        </eb-navbar>
        {domSpreads}
      </eb-page>
    );
  },
};
