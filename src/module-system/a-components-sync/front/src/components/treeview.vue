<script>
import Vue from 'vue';
import Utils from '@zhennann/framework7/packages/vue/utils/utils.js';
import Mixins from '@zhennann/framework7/packages/vue/utils/mixins';
const f7Treeview = Vue.options.components['f7-treeview'].extendOptions;

export default {
  name: 'eb-treeview',
  extends: f7Treeview,
  props: {
    options: {
      type: Object
    },
    onNodePerform: {
      type: Function,
    },
  },
  data() {
    return {
      treeNodes: [],
      treeviewId: Vue.prototype.$meta.util.nextId('treeview'),
    };
  },
  render() {
    //
    const _h = this.$createElement;
    const props = this.props;
    const {
      className,
      id,
      style
    } = props;
    const classes = Utils.classNames(className, 'treeview', Mixins.colorClasses(props));

    // nodes
    const nodes = this._renderNodes(_h, this.treeNodes, this.treeviewId);

    //
    return _h('div', {
      style: style,
      class: classes,
      attrs: {
        id: id
      }
    }, nodes);
  },
  created() {
    this.loadChildren();
  },
  methods: {
    _renderNodes(_h, nodes, attrIdParent) {
      const children = [];
      if (!nodes) return children;
      for (const _node of nodes) {
        // node
        const node = { ..._node };
        node.attrs = this.$utils.extend({}, _node.attrs);
        // attrs id
        node.attrs.id = `${attrIdParent}-${node.id}`;
        // attrs onNodePerform
        if (this.onNodePerform && !node.attrs.onPerform) {
          node.attrs.onPerform = (e, context) => {
            return this.onNodePerform(e, context, node);
          };
        }
        // scopedSlots
        const slots = this._renderScopeSlots(_h, _node);
        // children of node
        const childrenNode = this._renderNodes(_h, _node.children, node.attrs.id);
        // push
        children.push(_h('eb-treeview-item', {
          key: node.id,
          attrs: node.attrs,
          class: node.class,
          style: node.style,
          //scopedSlots,
          on: {
            'treeview:loadchildren': (e, done) => {
              this.onNodeLoadChildren(e, done, node)
            },
            'click': e => {
              this.$emit('node:click', e, node);
            }
          }
        }, slots.concat(childrenNode)));
      }
      return children;
    },
    _renderScopeSlots(_h, node) {
      const slots = [];
      for (let key of Object.keys(this.$scopedSlots)) {
        slots.push(_h('template', {
          slot: key,
        }, [this.$scopedSlots[key]({ node })]));
      }
      return slots;
    },
    loadChildren(node) {
      if (!this.options.loadChildren) return;
      return this.options.loadChildren(node).then(data => {
        const nodeChildren = node ? node.children : this.treeNodes;
        for (const item of data) {
          if (!item.children) item.children = [];
          nodeChildren.push(item);
        }
      });
    },
    onNodeLoadChildren(e, done, node) {
      const fn = this.loadChildren(node);
      if (!fn) return done();
      fn.then(() => {
        done();
      })
    },
  },
};

</script>
<style scoped>
</style>
