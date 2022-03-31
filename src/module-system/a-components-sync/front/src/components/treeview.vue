<script>
import Vue from 'vue';
import Utils from '@zhennann/framework7/packages/vue/utils/utils.js';
import Mixins from '@zhennann/framework7/packages/vue/utils/mixins';
const f7Treeview = Vue.options.components['f7-treeview'].extendOptions;

export default {
  meta: {
    global: true,
  },
  name: 'eb-treeview',
  extends: f7Treeview,
  props: {
    auto: {
      type: Boolean,
      default: true,
    },
    root: {
      type: Object,
    },
    onNodePerform: {
      type: Function,
    },
    onLoadChildren: {
      type: Function,
    },
  },
  data() {
    return {
      treeviewId: Vue.prototype.$meta.util.nextId('treeview'),
      treeviewRoot: null,
      selectedItem: null,
    };
  },
  render() {
    //
    const _h = this.$createElement;
    const props = this.props;
    const { className, id, style } = props;
    const classes = Utils.classNames(className, 'treeview', Mixins.colorClasses(props));

    // nodes
    const nodes = this.treeviewRoot ? this._renderNodes(_h, this.treeviewRoot.children) : [];

    //
    return _h(
      'div',
      {
        style,
        class: classes,
        attrs: {
          id,
        },
      },
      nodes
    );
  },
  watch: {
    root() {
      this.reload();
    },
  },
  created() {
    if (this.auto) {
      this.reload();
    }
  },
  methods: {
    async reload() {
      await this.load(this.root);
    },
    async load(root) {
      if (!root) return;
      this._initRootNode(root);
      await this._loadChildren(this.treeviewRoot);
    },
    async reloadNode(node, nodeNew) {
      if (node.root) return;
      // empty
      node.children.splice(0, node.children.length);
      // splice
      const nodeParent = node.parent;
      if (nodeNew) {
        const index = nodeParent.children.findIndex(item => item.id === node.id);
        node = this.$utils.extend({}, node, nodeNew);
        nodeParent.children.splice(index, 1, node);
      }
      // load again
      if (node._loaded) {
        node._loaded = false;
        await this._loadChildren(node);
      }
    },
    removeNode(node) {
      if (node.root) return;
      // splice
      const nodeParent = node.parent;
      const index = nodeParent.children.findIndex(item => item.id === node.id);
      nodeParent.children.splice(index, 1);
      // selected
      if (this.selectedItem && this.selectedItem.id === node.id) this.selectedItem = null;
    },
    treeUp(nodeStart, cb) {
      nodeStart = nodeStart || this.treeviewRoot;
      if (!nodeStart) return;
      this._treeUp(nodeStart, cb);
    },
    treeDown(nodeStart, cb) {
      nodeStart = nodeStart || this.treeviewRoot;
      if (!nodeStart) return;
      this._treeDown(nodeStart, cb);
    },
    async treeDownAsync(nodeStart, loadChildren, cb) {
      // arguments
      if (!cb) {
        cb = loadChildren;
        loadChildren = false;
      }
      // nodeStart
      nodeStart = nodeStart || this.treeviewRoot;
      if (!nodeStart) return;
      // treeDown
      await this._treeDownAsync(nodeStart, loadChildren, cb);
    },
    treeParent(nodeStart, cb) {
      if (!nodeStart) return;
      this._treeParent(nodeStart.parent, cb);
    },
    find(nodeStart, cb) {
      let node = null;
      this.treeDown(nodeStart, item => {
        if (cb(item)) {
          node = item;
          return false; // break
        }
      });
      return node;
    },
    // options: loadChildren
    async findAsync(nodeStart, loadChildren, cb) {
      let node = null;
      await this.treeDownAsync(nodeStart, loadChildren, async item => {
        const res = await cb(item);
        if (res) {
          node = item;
          return false; // break
        }
      });
      return node;
    },
    async findNodes(nodeIds, loadChildren) {
      if (!nodeIds) return [];
      if (!Array.isArray(nodeIds)) {
        nodeIds = [nodeIds];
      }
      const nodesRes = [];
      for (const nodeId of nodeIds) {
        const node = await this.findAsync(null, loadChildren, item => {
          return item.id === nodeId;
        });
        if (node) {
          nodesRes.push(node);
        }
      }
      return nodesRes;
    },
    async checkNodes(nodeIds, loadChildren, expandNode) {
      return await this._checkNodesGeneral('check', nodeIds, loadChildren, expandNode);
    },
    async uncheckNodes(nodeIds, loadChildren) {
      return await this._checkNodesGeneral('uncheck', nodeIds, loadChildren);
    },
    async toggleNodes(nodeIds, loadChildren, expandNode) {
      return await this._checkNodesGeneral('toggle', nodeIds, loadChildren, expandNode);
    },
    async _checkNodesGeneral(mode, nodeIds, loadChildren, expandNode) {
      const nodes = await this.findNodes(nodeIds, loadChildren);
      for (const node of nodes) {
        if (mode === 'check') {
          this._onNodeChange(node, true);
        } else if (mode === 'uncheck') {
          this._onNodeChange(node, false);
        } else if (mode === 'toggle') {
          this._onNodeChange(node, !node.attrs.checked);
        }
        if (expandNode) {
          this.expandNode(node);
        }
      }
      return nodes;
    },
    expandNode(node) {
      // current
      if (node.attrs.toggle) {
        this._openNode(node);
      }
      // parent
      this.treeParent(node, item => {
        if (item.attrs.toggle) {
          this._openNode(item);
        }
      });
    },
    _openNode(node) {
      const $el = this.getElementByNode(node);
      this.$f7.treeview.open($el);
    },
    getElementByNode(node) {
      const elementId = node.attrs.id;
      return this.$$(`#${elementId}`);
    },
    selected() {
      return this.selectedItem;
    },
    checked(options) {
      if (!this.treeviewRoot) return this.treeviewRoot.attrs.multiple ? [] : null;

      // single
      if (!this.treeviewRoot.attrs.multiple) {
        let checkedNode = null;
        this.treeDown(null, item => {
          if (item.attrs.checked) {
            checkedNode = item;
            return false; // break
          }
        });
        return checkedNode;
      }

      // multiple
      const checkedNodes = [];
      this.treeDown(null, item => {
        if (item.attrs.checked) {
          // push this
          checkedNodes.push(item);
          // break children
          return true;
        }
      });
      return checkedNodes;
    },
    _treeParent(node, cb) {
      if (!node) return;
      const res = cb(node);
      if (res === false) return false; // return immediately
      return this._treeParent(node.parent, cb);
    },
    _treeUp(nodeParent, cb) {
      // children
      for (const node of nodeParent.children) {
        // children first
        let res = this._treeUp(node, cb);
        if (res === false) return false; // return immediately
        if (res !== true) {
          // current
          res = cb(node, nodeParent);
          if (res === false) return false; // return immediately
        }
      }
    },
    _treeDown(nodeParent, cb) {
      // children
      for (const node of nodeParent.children) {
        // current first
        let res = cb(node, nodeParent);
        if (res === false) return false; // return immediately
        if (res !== true) {
          // children
          res = this._treeDown(node, cb);
          if (res === false) return false; // return immediately
        }
      }
    },
    async _treeDownAsync(nodeParent, loadChildren, cb) {
      // children
      for (const node of nodeParent.children) {
        // current first
        let res = await cb(node, nodeParent);
        if (res === false) return false; // return immediately
        if (res !== true) {
          // loadChildren
          if (loadChildren) {
            await this._loadChildren(node);
          }
          // children
          res = await this._treeDownAsync(node, loadChildren, cb);
          if (res === false) return false; // return immediately
        }
      }
    },
    _initRootNode(root) {
      const _root = this.$utils.extend({}, root);
      // root
      _root.root = true;
      // attrs
      if (!_root.attrs) _root.attrs = {};
      // attrs id
      _root.attrs.id = this.treeviewId;
      // loadChildren
      if (_root.attrs.loadChildren === undefined && this.onLoadChildren) _root.attrs.loadChildren = true;
      // children
      if (!_root.children) _root.children = [];
      // record parent
      this.treeDown(_root, (item, itemParent) => {
        item.parent = itemParent;
      });
      // ready
      this.treeviewRoot = _root;
    },
    _renderNode(_h, node) {
      // node
      const _node = { ...node };
      _node.attrs = this.$utils.extend({}, node.attrs);
      // attrs
      if (_node.attrs.itemToggle === undefined) _node.attrs.itemToggle = this.treeviewRoot.attrs.itemToggle;
      // if (_node.attrs.opened === undefined) _node.attrs.opened = this.treeviewRoot.attrs.opened;
      if (_node.attrs.checkbox === undefined) _node.attrs.checkbox = this.treeviewRoot.attrs.checkbox;
      if (_node.attrs.selectable === undefined) _node.attrs.selectable = this.treeviewRoot.attrs.selectable;
      if (_node.attrs.selectable) _node.attrs.selected = this.selectedItem && this.selectedItem.id === node.id;
      if (_node.attrs.disabled === undefined) _node.attrs.disabled = this.treeviewRoot.attrs.disabled;
      // attrs folder
      if (_node.attrs.folder) {
        if (_node.attrs.opened === true) {
          _node.attrs.iconF7 = '::folder-open';
        } else {
          _node.attrs.iconF7 = '::folder';
        }
      }
      // attrs onNodePerform
      if (this.onNodePerform && node.attrs.onPerform === undefined) {
        _node.attrs.onPerform = (e, context) => {
          return this.onNodePerform(e, context, node);
        };
      }
      // children
      let children = [];
      // checkbox
      const radio = !this.treeviewRoot.attrs.multiple;
      if (_node.attrs.checkbox && radio) {
        children.push(
          _h('f7-radio', {
            key: '__radio',
            slot: 'content-start',
            attrs: {
              checked: _node.attrs.checked,
              disabled: _node.attrs.disabled,
            },
            on: {
              change: e => {
                this._onNodeChange(node, e.target.checked);
              },
            },
          })
        );
      } else if (_node.attrs.checkbox && !radio) {
        children.push(
          _h('f7-checkbox', {
            key: '__checkbox',
            slot: 'content-start',
            attrs: {
              checked: _node.attrs.checked,
              disabled: _node.attrs.disabled,
              indeterminate: _node.attrs.indeterminate,
            },
            on: {
              change: () => {
                this._onNodeChange(node, !node.attrs.checked);
              },
            },
          })
        );
      }
      // scopedSlots
      const slots = this._renderScopeSlots(_h, node);
      if (slots && slots.length > 0) children = children.concat(slots);
      // children of node
      const childrenNode = this._renderNodes(_h, node.children);
      if (childrenNode && childrenNode.length > 0) children = children.concat(childrenNode);
      // ok
      return _h(
        'eb-treeview-item',
        {
          key: _node.id,
          attrs: _node.attrs,
          class: _node.class,
          style: _node.style,
          on: {
            'treeview:loadchildren': (e, done) => {
              this._onNodeLoadChildren(e, done, node);
            },
            click: e => {
              this._onNodeClick(e, node);
            },
            contextmenuOpened: e => {
              this.$emit('node:contextmenuOpened', node, e);
              this.$emit('nodeContextmenuOpened', node, e);
            },
          },
        },
        children
      );
    },
    _renderNodes(_h, nodes) {
      const children = [];
      if (!nodes) return children;
      for (const node of nodes) {
        children.push(this._renderNode(_h, node));
      }
      return children;
    },
    _renderScopeSlots(_h, node) {
      const slots = [];
      for (const key of Object.keys(this.$scopedSlots)) {
        slots.push(
          _h(
            'template',
            {
              key: `__slot:${key}`,
              slot: key,
            },
            [this.$scopedSlots[key]({ node })]
          )
        );
      }
      return slots;
    },
    _needLoadChildren(node) {
      return this.onLoadChildren && node.attrs.loadChildren && !node._loaded;
    },
    childrenLoaded(node, children) {
      this.$set(node, '_loaded', true);
      if (!node.children) node.children = [];
      const nodeChildren = node.children;
      for (const item of children) {
        // attrs id
        item.attrs.id = `${node.attrs.id}-${item.id}`;
        // children
        if (!item.children) item.children = [];
        // checked
        if (this.treeviewRoot.attrs.multiple && node.attrs.checked) {
          item.attrs.checked = true;
        }
        // push
        nodeChildren.push(item);
      }
      // record parent
      for (const item of nodeChildren) {
        item.parent = node;
      }
      return nodeChildren;
    },
    async _loadChildren(node) {
      if (!this._needLoadChildren(node)) return node.children;
      const data = await this.onLoadChildren(node);
      return this.childrenLoaded(node, data);
    },
    _onNodeLoadChildren(e, done, node) {
      this._loadChildren(node)
        .then(() => {
          this.$nextTick(() => {
            return done();
          });
        })
        .catch(done);
    },
    _onNodeClick(e, node) {
      // target
      const $target = this.$$(e.target);

      // selectable
      const selectable =
        node.attrs.selectable === undefined ? this.treeviewRoot.attrs.selectable : node.attrs.selectable;
      if (selectable && !$target.is('.treeview-toggle')) {
        this.selectedItem = node;
      }

      // checkbox
      if ($target.is('input') || $target.is('.icon-checkbox') || $target.is('.icon-radio')) {
        e.preventF7Router = true;
        return;
      }

      // ignore
      let ignore = false;

      // checkbox
      const disabled = node.attrs.disabled === undefined ? this.treeviewRoot.attrs.disabled : node.attrs.disabled;
      const checkbox = node.attrs.checkbox === undefined ? this.treeviewRoot.attrs.checkbox : node.attrs.checkbox;
      const checkOnLabel =
        node.attrs.checkOnLabel === undefined ? this.treeviewRoot.attrs.checkOnLabel : node.attrs.checkOnLabel;
      if (!disabled && checkbox && checkOnLabel) {
        const radio = !this.treeviewRoot.attrs.multiple;
        if (radio) {
          if (!node.attrs.checked) this._onNodeChange(node, true);
        } else {
          this._onNodeChange(node, !node.attrs.checked);
        }
        ignore = true;
      }

      if (ignore) {
        e.preventF7Router = true;
        return;
      }

      // node:click
      this.$emit('node:click', node, e);
      this.$emit('nodeClick', node, e);
    },
    _onNodeChange(node, checked) {
      // node current
      this.$set(node.attrs, 'checked', checked);
      this.$set(node.attrs, 'indeterminate', false);
      if (!this.treeviewRoot.attrs.multiple) {
        // single
        if (checked) {
          // uncheckall
          this.treeUp(null, item => {
            if (item.id !== node.id && item.attrs.checked) {
              this.$set(item.attrs, 'checked', false);
              return false; // break
            }
          });
        }
      } else {
        // multiple
        // children to checked
        this.treeUp(node, item => {
          this.$set(item.attrs, 'checked', checked);
          this.$set(item.attrs, 'indeterminate', false);
        });
        // parent to checked/indeterminate
        this.treeParent(node, item => {
          if (!item.attrs.checkbox) return false; // break
          const every = item.children.every(_item => _item.attrs.checked);
          const some = item.children.some(_item => _item.attrs.checked || _item.attrs.indeterminate);
          if (every) {
            this.$set(item.attrs, 'checked', true);
            this.$set(item.attrs, 'indeterminate', false);
          } else if (some) {
            this.$set(item.attrs, 'checked', false);
            this.$set(item.attrs, 'indeterminate', true);
          } else {
            this.$set(item.attrs, 'checked', false);
            this.$set(item.attrs, 'indeterminate', false);
          }
        });
      }
      // node:change
      this.$emit('node:change', node);
      this.$emit('nodeChange', node);
    },
  },
};
</script>
<style scoped></style>
