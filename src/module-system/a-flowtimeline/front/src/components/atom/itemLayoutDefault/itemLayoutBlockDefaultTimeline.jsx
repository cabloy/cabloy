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
    blockConfig: {
      type: Object,
    },
  },
  data() {
    return {};
  },
  methods: {
    _renderContainer() {
      return (
        <f7-card class="demo-card-header-pic">
          <f7-card-header>
            <f7-block-title>{this.$text('TimeLine_ToDoList')}</f7-block-title>
          </f7-card-header>
          <f7-card-content>
            <p class="date">Posted on January 21, 2015</p>
            <p>
              Quisque eget vestibulum nulla. Quisque quis dui quis ex ultricies efficitur vitae non felis. Phasellus
              quis nibh hendrerit...
            </p>
          </f7-card-content>
          <f7-card-footer>
            <f7-link>Like</f7-link>
            <f7-link>Read more</f7-link>
          </f7-card-footer>
        </f7-card>
      );
    },
  },
  render() {
    return this._renderContainer();
  },
};
