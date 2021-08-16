import ActionCreate from './action/actionCreate.js';
import ActionWrite from './action/actionWrite.js';

export default {
  meta: {
    global: false,
  },
  mixins: [
    ActionCreate, //
    ActionWrite,
  ],
  props: {
    ctx: {
      type: Object,
    },
    action: {
      type: Object,
    },
    item: {
      type: Object,
    },
  },
  data() {
    return {
      detailItem: null,
      meta: null,
      //
      flowTaskId: 0,
      atomKey: null,
      detailKey: null,
      detailClass: null,
    };
  },
  created() {
    this.init();
  },
  methods: {
    init() {
      // detailItem
      this.detailItem = this.item.item;
      // meta
      this.meta = this.item.meta;
      // flowTaskId
      this.flowTaskId = (this.meta && this.meta.flowTaskId) || 0;
      // atomKey
      this.atomKey = { atomId: this.detailItem.atomId };
      // key
      this.detailKey = {
        detailId: this.detailItem.detailId,
        detailItemId: this.detailItem.detailItemId,
      };
      // detailClass
      this.detailClass = {
        module: this.detailItem.module,
        detailClassName: this.detailItem.detailClassName,
      };
    },
    async onAction() {
      const action = this.action;
      // do
      if (action.name === 'create' || action.action === 'create') {
        return await this._onActionCreate();
      } else if (action.name === 'delete') {
        // delete
        await ctx.$view.dialog.confirm();
        // delete
        await ctx.$api.post('/a/detail/detail/delete', { flowTaskId, key });
        // event
        ctx.$meta.eventHub.$emit('detail:action', { atomKey, detailClass, key, action });
        // back
        if (ctx.$pageRoute.path === '/a/detail/detail/item') {
          ctx.$f7router.back();
        }
      } else if (action.name === 'save') {
        // save
        await ctx.$api.post('/a/detail/detail/write', { flowTaskId, key, item });
        ctx.$meta.eventHub.$emit('detail:action', { atomKey, detailClass, key, action });
        // toast
        return ctx.$text('Saved');
      } else if (action.name === 'read') {
        const queries = {
          mode: 'view',
          detailId: item.detailId,
          detailItemId: item.detailItemId,
          flowTaskId,
        };
        const url = ctx.$meta.util.combineQueries('/a/detail/detail/item', queries);
        ctx.$view.navigate(url, action.navigateOptions);
      } else if (action.name === 'write') {
        return await this._onActionWrite();
      } else if (action.name === 'clone') {
        // clone
        try {
          const keyDest = await ctx.$api.post('/a/detail/detail/clone', { flowTaskId, key });
          const _item = {
            ...item,
            detailId: keyDest.detailId,
            detailItemId: keyDest.detailItemId,
          };
          // event
          ctx.$meta.eventHub.$emit('detail:action', { atomKey, detailClass, key: keyDest, action: { name: 'create' } });
          // write
          const actionsAll = await ctx.$store.dispatch('a/base/getDetailActions');
          let actionWrite = actionsAll[item.module][item.detailClassName].write;
          actionWrite = ctx.$utils.extend({}, actionWrite);
          if (ctx.$pageRoute.path === '/a/detail/detail/item') {
            actionWrite.navigateOptions = { target: '_self' };
          } else {
            actionWrite.navigateOptions = action.navigateOptions;
          }
          await ctx.$meta.util.performAction({ ctx, action: actionWrite, item: { item: _item, meta } });
        } catch (err) {
          if (err.code === 422) {
            throw new Error(err.message[0].message);
          }
          throw err;
        }
      } else if (action.name === 'moveUp') {
        // moveUp
        const result = await ctx.$api.post('/a/detail/detail/moveUp', { flowTaskId, key });
        ctx.$meta.eventHub.$emit('detail:action', { atomKey, detailClass, key, action, result });
      } else if (action.name === 'moveDown') {
        // moveUp
        const result = await ctx.$api.post('/a/detail/detail/moveDown', { flowTaskId, key });
        ctx.$meta.eventHub.$emit('detail:action', { atomKey, detailClass, key, action, result });
      }
    },
  },
};
