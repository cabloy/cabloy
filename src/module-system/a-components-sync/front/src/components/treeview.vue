<script>
import Vue from 'vue';
import Utils from '@zhennann/framework7/packages/vue/utils/utils.js';
import Mixins from '@zhennann/framework7/packages/vue/utils/mixins';
const f7Treeview = Vue.options.components['f7-treeview'].extendOptions;

export default {
  name: 'eb-treeview',
  extends: f7Treeview,
  props: {
    root: {
      type: Object,
    },
    onNodePerform: {
      type: Function,
    },
    onLoadChildren: {
      type: Function
    },
  },
  data() {
    return {
      treeNodes: [],
      treeviewId: Vue.prototype.$meta.util.nextId('treeview'),
      treeviewNode: null,
      selectedItem: null,
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
    const nodes = this.treeviewNode ? this._renderNodes(_h, this.treeviewNode.children, this.treeviewId) : [];

    //
    return _h('div', {
      style: style,
      class: classes,
      attrs: {
        id: id
      }
    }, nodes);
  },
  watch: {
    root() {
      this.reload();
    }
  },
  created() {
    this.reload();
  },
  methods: {
    reload() {
      this.treeNodes = [];
      this._initRootNode();
      this._loadChildren(this.treeviewNode);
    },
    _initRootNode() {
      const _root = this.$utils.extend({}, this.root);
      // root
      _root.root = true;
      // attrs
      if (!_root.attrs) _root.attrs = {};
      // loadChildren
      if (_root.attrs.loadChildren === undefined && this.onLoadChildren) _root.attrs.loadChildren = true;
      // children
      if (!_root.children) {
        _root.children = this.treeNodes;
      } else {
        _root.children = _root.children.concat(this.treeNodes);
      }
      // ready
      this.treeviewNode = _root;
    },
    _renderNode(_h, node, attrIdParent) {
      // node
      const _node = { ...node };
      _node.attrs = this.$utils.extend({}, node.attrs);
      // attrs id
      _node.attrs.id = `${attrIdParent}-${node.id}`;
      // attrs
      if (_node.attrs.itemToggle === undefined) _node.attrs.itemToggle = this.treeviewNode.attrs.itemToggle;
      if (_node.attrs.opened === undefined) _node.attrs.opened = this.treeviewNode.attrs.opened;
      if (_node.attrs.checkbox === undefined) _node.attrs.checkbox = this.treeviewNode.attrs.checkbox;
      if (_node.attrs.selectable === undefined) _node.attrs.selectable = this.treeviewNode.attrs.selectable;
      if (_node.attrs.selectable) _node.attrs.selected = (this.selectedItem && this.selectedItem.id === node.id);
      // attrs onNodePerform
      if (this.onNodePerform && node.attrs.onPerform === undefined) {
        _node.attrs.onPerform = (e, context) => {
          return this.onNodePerform(e, context, node);
        };
      }
      // children
      let children = [];
      // checkbox
      if (_node.attrs.checkbox) {
        children.push(_h('f7-checkbox', {
          slot: 'content-start',
          attrs: {
            checked: _node.attrs.checked,
          },
          on: {
            change: e => {
              this.onNodeChange(node, !e.target.checked);
            },
          }
        }));
      }
      // scopedSlots
      const slots = this._renderScopeSlots(_h, node);
      if (slots && slots.length > 0) children = children.concat(slots);
      // children of node
      const childrenNode = this._renderNodes(_h, node.children, _node.attrs.id);
      if (childrenNode && childrenNode.length > 0) children = children.concat(childrenNode);
      // ok
      return _h('eb-treeview-item', {
        key: _node.id,
        attrs: _node.attrs,
        class: _node.class,
        style: _node.style,
        on: {
          'treeview:loadchildren': (e, done) => {
            this.onNodeLoadChildren(e, done, node)
          },
          'click': e => {
            this.onNodeClick(e, node);
          }
        }
      }, children);
    },
    _renderNodes(_h, nodes, attrIdParent) {
      const children = [];
      if (!nodes) return children;
      for (const node of nodes) {
        children.push(this._renderNode(_h, node, attrIdParent));
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
    _loadChildren(node) {
      if (!this.onLoadChildren || !node || !node.attrs.loadChildren) return;
      return this.onLoadChildren(node).then(data => {
        const nodeChildren = node.root ? this.treeNodes : node.children;
        for (const item of data) {
          // children
          if (!item.children) item.children = [];
          // push
          nodeChildren.push(item);
        }
      });
    },
    onNodeLoadChildren(e, done, node) {
      const fn = this._loadChildren(node);
      if (!fn) {
        this.$nextTick(() => {
          return done();
        });
        return;
      }
      fn.then(() => {
        done();
      })
    },
    onNodeClick(e, node) {
      // target
      const $target = this.$$(e.target);

      // selectable
      const selectable = node.attrs.selectable === undefined ? this.treeviewNode.attrs.selectable : node.attrs.selectable;
      if (selectable && !$target.is('.treeview-toggle')) {
        this.selectedItem = node;
      }

      // ignore
      let ignore = false;

      // checkbox
      if ($target.is('input') || $target.is('.icon-checkbox')) ignore = true;

      // checkbox
      const checkbox = node.attrs.checkbox === undefined ? this.treeviewNode.attrs.checkbox : node.attrs.checkbox;
      const checkOnLabel = node.attrs.checkOnLabel === undefined ? this.treeviewNode.attrs.checkOnLabel : node.attrs.checkOnLabel;
      if (checkbox && checkOnLabel) {
        this.onNodeChange(node, !node.attrs.checked);
        ignore = true;
      }

      if (ignore) {
        e.preventF7Router = true;
        return;
      }

      // node:click
      this.$emit('node:click', e, node);

    },
    onNodeChange(node, checked) {
      this.$set(node.attrs, 'checked', checked);
    }
  },
};

</script>
<style scoped>
</style>
