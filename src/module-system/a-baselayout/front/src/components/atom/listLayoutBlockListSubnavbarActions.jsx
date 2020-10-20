export default {
  meta: {
    global: false,
  },
  props: {
    layoutManager: {
      type: Object,
    },
    blockConfig: {
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
  render() {
    return (
      <f7-subnavbar>
        <div class="atom-list-subnavbarActions-container">
          <div class="block block-left">ss</div>
          <div class="block block-right">
            <f7-link>List</f7-link>
            <f7-link >drafts</f7-link>
            <f7-link >stars</f7-link>
          </div>
        </div>

      </f7-subnavbar>
    );
  },
};
