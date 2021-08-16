import ActionCreate from './action/actionCreate.js';
import ActionDelete from './action/actionDelete.js';
import ActionSave from './action/actionSave.js';
import ActionSubmit from './action/actionSubmit.js';
import ActionWrite from './action/actionWrite.js';
import ActionClone from './action/actionClone.js';
import ActionHistory from './action/actionHistory.js';
import ActionFormal from './action/actionFormal.js';
import ActionDraft from './action/actionDraft.js';

export default {
  meta: {
    global: false,
  },
  mixins: [
    ActionCreate, //
    ActionDelete,
    ActionSave,
    ActionSubmit,
    ActionWrite,
    ActionClone,
    ActionHistory,
    ActionFormal,
    ActionDraft,
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
  methods: {
    async onAction() {
      const { action } = this.$props;
      if (action.name === 'create' || action.action === 'create') {
        return await this._onActionCreate();
      } else if (action.name === 'delete') {
        return await this._onActionDelete();
      } else if (action.name === 'save') {
        return await this._onActionSave();
      } else if (action.name === 'submit') {
        return await this._onActionSubmit();
      } else if (action.name === 'write') {
        return await this._onActionWrite();
      } else if (action.name === 'clone') {
        return await this._onActionClone();
      } else if (action.name === 'history') {
        return await this._onActionHistory();
      } else if (action.name === 'formal') {
        return await this._onActionFormal();
      } else if (action.name === 'draft') {
        return await this._onActionDraft();
      } else if (action.name === 'selectLocale') {
        return await this._onActionSelectLocale({ ctx, action, item });
      } else if (action.name === 'selectResourceType') {
        return await this._onActionSelectResourceType({ ctx, action, item });
      } else if (action.name === 'enable') {
        const key = { atomId: item.atomId, itemId: item.itemId };
        return await this._onActionEnable({ ctx, key });
      } else if (action.name === 'disable') {
        const key = { atomId: item.atomId, itemId: item.itemId };
        return await this._onActionDisable({ ctx, key });
      } else if (action.name === 'workflow') {
        const flowId = item.atomFlowId;
        const url = `/a/flowtask/flow?flowId=${flowId}`;
        ctx.$view.navigate(url, {});
      }
    },
    async _onActionReadGeneral({ atomId }) {
      const { ctx, item } = this.$props;
      const actionsAll = await ctx.$store.dispatch('a/base/getActions');
      let actionRead = actionsAll[item.module][item.atomClassName].read;
      actionRead = ctx.$utils.extend({}, actionRead);
      await ctx.$meta.util.performAction({ ctx, action: actionRead, item: { atomId } });
    },

    async _onActionSelectLocale({ ctx, action, item }) {
      if (item && item.module && item.atomClassName) {
        const atomClasses = await ctx.$store.dispatch('a/base/getAtomClasses');
        const atomClass = atomClasses[item.module][item.atomClassName];
        // not support language
        if (!atomClass.language) {
          return null;
        }
      }
      // only one
      const locales = await ctx.$store.dispatch('a/base/getLocales');
      if (locales.length === 1) {
        return locales[0];
      }
      // choose
      return new Promise((resolve, reject) => {
        const hostEl = ctx.$view.getHostEl();
        const targetEl = action.targetEl;
        const buttons = [
          {
            text: ctx.$text('SelectLanguageTip'),
            label: true,
          },
        ];
        let resolved = false;
        function onButtonClick(locale) {
          resolved = true;
          resolve(locale);
        }
        for (const locale of locales) {
          buttons.push({
            text: locale.title,
            onClick: () => {
              onButtonClick(locale);
            },
          });
        }
        const actions = ctx.$f7.actions.create({ hostEl, buttons, targetEl });
        function onActionsClosed() {
          actions.destroy();
          if (!resolved) {
            resolved = true;
            reject(new Error());
          }
        }
        actions.open().once('actionsClosed', onActionsClosed).once('popoverClosed', onActionsClosed);
      });
    },
    async _onActionSelectResourceType({ ctx, action /* , item*/ }) {
      const resourceTypes = await ctx.$store.dispatch('a/base/getResourceTypes');
      // choose
      return new Promise((resolve, reject) => {
        const hostEl = ctx.$view.getHostEl();
        const targetEl = action.targetEl;
        const buttons = [
          {
            text: ctx.$text('SelectResourceTypeTip'),
            label: true,
          },
        ];
        let resolved = false;
        function onButtonClick(locale) {
          resolved = true;
          resolve(locale);
        }
        for (const key in resourceTypes) {
          const resourceType = resourceTypes[key];
          buttons.push({
            text: resourceType.titleLocale,
            onClick: () => {
              onButtonClick(key);
            },
          });
        }
        const actions = ctx.$f7.actions.create({ hostEl, buttons, targetEl });
        function onActionsClosed() {
          actions.destroy();
          if (!resolved) {
            resolved = true;
            reject(new Error());
          }
        }
        actions.open().once('actionsClosed', onActionsClosed).once('popoverClosed', onActionsClosed);
      });
    },
    async _onActionEnable({ ctx, key }) {
      await ctx.$api.post('/a/base/atom/enable', { key });
      ctx.$meta.eventHub.$emit('atom:action', { key, action: { name: 'save' } });
    },
    async _onActionDisable({ ctx, key }) {
      await ctx.$api.post('/a/base/atom/disable', { key });
      ctx.$meta.eventHub.$emit('atom:action', { key, action: { name: 'save' } });
    },
  },
};
