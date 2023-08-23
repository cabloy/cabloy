import Vue from 'vue';
import TreeviewData from './treeviewData.js';
import TreeviewAdapterFn from './treeviewAdapter.js';
const f7Treeview = Vue.options.components['f7-treeview'].extendOptions;

export default {
  meta: {
    global: true,
  },
  name: 'eb-treeview',
  extends: f7Treeview,
  mixins: [TreeviewData],
  props: {
    // disabled for treeviewDataCustom
    auto: {
      type: Boolean,
      default: true,
    },
    // disabled for treeviewDataCustom
    root: {
      type: Object,
    },
    onNodePerform: {
      type: Function,
    },
    onLoadChildren: {
      type: Function,
    },
    treeviewDataCustom: {
      type: Object,
    },
  },
  data() {
    return {};
  },
  computed: {
    treeviewData() {
      return this.treeviewDataCustom || this;
    },
  },
  watch: {
    root() {
      if (this.treeviewDataCustom) return;
      this.reload();
    },
  },
  // not use created
  mounted() {
    this._start();
  },
  methods: {
    async _start() {
      if (this.treeviewDataCustom) return;
      // adapter
      const AdapterDefault = this._createAdapterDefault();
      this.treeviewData.setAdapter(AdapterDefault);
      // check auto
      if (this.auto) {
        // load
        await this.reload();
      }
    },
    _createAdapterDefault() {
      return TreeviewAdapterFn(this);
    },
    async reload() {
      if (this.treeviewDataCustom) return;
      await this.treeviewData.load(this.root);
    },
    _openNodeContextMenu(node) {
      return this._onNodeContextMenuOpened(null, node);
    },
    _onNodeContextMenuOpened(e, node) {
      // popover
      const domNode = this.getElementByNode(node);
      const domPopover = domNode.find('.popover').eq(0);
      let domTarget = domNode.find('.treeview-item-root-end').eq(0);
      if (domTarget.length === 0) {
        domTarget = domNode.find('.treeview-item-root').eq(0);
      }
      if (domPopover.length === 0 || domTarget.length === 0) return false;
      // open
      this.$f7.popover.open(domPopover[0], domTarget[0]);
      // select
      this.treeviewData.selectNode(node.id);
      // event
      this.$emit('node:contextmenuOpened', node, e);
      this.$emit('nodeContextmenuOpened', node, e);
      // ok
      return true;
    },
    _onNodeLoadChildren(/* e, done, node*/) {
      throw new Error('should not invoked here');
    },
    _onNodeOpen(e, node) {
      this.treeviewData.openNode(node);
    },
    _onNodeClose(e, node) {
      this.treeviewData.closeNode(node);
    },
    _onNodeToggle(e, node) {
      this.treeviewData.switchNode(node);
    },
    _onNodeClick(e, node) {
      // target
      const $target = this.$$(e.target);

      // selectable
      if (!$target.is('.treeview-toggle')) {
        this.treeviewData._setSelectedNode(node);
      }

      // checkbox
      if ($target.is('input') || $target.is('.icon-checkbox') || $target.is('.icon-radio')) {
        e.preventF7Router = true;
        return;
      }

      // ignore
      let ignore = false;

      // checkbox
      const treeviewRoot = this.treeviewData.treeviewRoot;
      const disabled = node.attrs.disabled === undefined ? treeviewRoot.attrs.disabled : node.attrs.disabled;
      const checkbox = node.attrs.checkbox === undefined ? treeviewRoot.attrs.checkbox : node.attrs.checkbox;
      const checkOnLabel =
        node.attrs.checkOnLabel === undefined ? treeviewRoot.attrs.checkOnLabel : node.attrs.checkOnLabel;
      if (!disabled && checkbox && checkOnLabel) {
        const radio = !treeviewRoot.attrs.multiple;
        if (radio) {
          if (!node.attrs.checked) this.treeviewData._onNodeChange(node, true);
        } else {
          this.treeviewData._onNodeChange(node, !node.attrs.checked);
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
    getElementByNode(node) {
      const elementId = node.attrs.id;
      return this.$$(`#${elementId}`);
    },
    _prepareNodeAttrs(node) {
      // node
      const _node = { ...node };
      _node.attrs = this.$utils.extend({}, node.attrs);
      // attrs
      const treeviewRoot = this.treeviewData.treeviewRoot;
      if (_node.attrs.itemToggle === undefined) _node.attrs.itemToggle = treeviewRoot.attrs.itemToggle;
      if (_node.attrs.opened === undefined) _node.attrs.opened = false;
      if (_node.attrs.checkbox === undefined) _node.attrs.checkbox = treeviewRoot.attrs.checkbox;
      if (_node.attrs.selectable === undefined) _node.attrs.selectable = treeviewRoot.attrs.selectable;
      if (_node.attrs.selectable) {
        _node.attrs.selected = this.treeviewData.selectedItem && this.treeviewData.selectedItem.id === node.id;
      }
      if (_node.attrs.disabled === undefined) _node.attrs.disabled = treeviewRoot.attrs.disabled;
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
      // ok
      return _node;
    },
    _renderNode(_h, node) {
      // node
      const _node = this._prepareNodeAttrs(node);
      // children
      let children = [];
      // checkbox
      const radio = !this.treeviewData.treeviewRoot.attrs.multiple;
      if (_node.attrs.checkbox && radio) {
        children.push(
          _h('eb-radio', {
            key: '__radio',
            slot: 'content-start',
            props: {
              value: _node.attrs.checked,
              disabled: _node.attrs.disabled,
            },
            on: {
              input: value => {
                this.treeviewData._onNodeChange(node, value);
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
                this.treeviewData._onNodeChange(node, !node.attrs.checked);
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
              this._onNodeContextMenuOpened(e, node);
            },
            treeviewOpen: () => {
              this._onNodeOpen(null, node);
            },
            treeviewClose: () => {
              this._onNodeClose(null, node);
            },
            treeviewToggle: () => {
              this._onNodeToggle(null, node);
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
  },
  render() {
    //
    const _h = this.$createElement;
    const props = this.props;
    let { className, id, style } = props;
    const classes = this.$vuef7.utils.classNames(className, 'treeview', this.$vuef7.mixins.colorClasses(props));

    if (!id) id = this.treeviewData.treeviewId;

    // nodes
    const nodes = this.treeviewData.treeviewRoot ? this._renderNodes(_h, this.treeviewData.treeviewRoot.children) : [];

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
};
