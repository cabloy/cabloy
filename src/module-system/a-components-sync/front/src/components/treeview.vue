<script>
import Vue from 'vue';
import Utils from '@zhennann/framework7/packages/vue/utils/utils.js';
import Mixins from '@zhennann/framework7/packages/vue/utils/mixins';
import treeviewBase from '../common/treeviewBase.js';
import treeviewAdapter from '../common/treeviewAdapter.js';
const f7Treeview = Vue.options.components['f7-treeview'].extendOptions;

export default {
  meta: {
    global: true,
  },
  name: 'eb-treeview',
  extends: f7Treeview,
  mixins: [treeviewBase],
  props: {
    onNodePerform: {
      type: Function,
    },
    onLoadChildren: {
      type: Function,
    },
  },
  data() {
    return {};
  },
  render() {
    //
    const _h = this.$createElement;
    const props = this.props;
    let { className, id, style } = props;
    const classes = Utils.classNames(className, 'treeview', Mixins.colorClasses(props));

    if (!id) id = this.treeviewId;

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
  // not use created
  mounted() {
    this.setAdapter(treeviewAdapter(this));
    this.start();
  },
  methods: {
    _openNode(node) {
      const $el = this.getElementByNode(node);
      this.$f7.treeview.open($el);
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
      this.selectNode(node.id);
      // event
      this.$emit('node:contextmenuOpened', node, e);
      this.$emit('nodeContextmenuOpened', node, e);
      // ok
      return true;
    },
    getElementByNode(node) {
      const elementId = node.attrs.id;
      return this.$$(`#${elementId}`);
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
              this._onNodeContextMenuOpened(e, node);
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
    _onNodeClick(e, node) {
      // target
      const $target = this.$$(e.target);

      // selectable
      if (!$target.is('.treeview-toggle')) {
        this._setSelectedNode(node);
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
  },
};
</script>
<style scoped></style>
