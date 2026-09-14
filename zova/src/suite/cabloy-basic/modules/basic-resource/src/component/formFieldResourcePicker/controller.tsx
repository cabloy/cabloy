import type { TableIdentity } from 'table-identity';
import type { IComponentOptions } from 'zova';
import type { IFormFieldComponentOptions, IJsxRenderContextFormField } from 'zova-module-a-form';
import type {
  IResourceFormFieldOptionsBase,
  IResourceTableSelectionPayload,
  ITableQuery,
} from 'zova-module-a-openapi';
import type {
  IResourcePickerPageOptions,
  IResourcePickerPageSession,
} from 'zova-module-rest-resource';

import { classes } from 'typestyle';
import { BeanControllerBase, Use } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { ZFormField, ZFormFieldPreset } from 'zova-module-a-form';
import { $QueryEnsureLoaded } from 'zova-module-a-model';
import { resolvePickerSelectionMax } from 'zova-module-basic-page';
import { ZSelect, ZSelectProps } from 'zova-module-basic-select';
import { resourcePickerPageHostKey } from 'zova-module-rest-resource';
import { ModelResource } from 'zova-module-rest-resource';

import type { TypeResourcePickerSelectionMode } from '../../lib/resourcePicker.js';

import {
  normalizeResourcePickerIds,
  resolveResourcePickerValue,
} from '../../lib/resourcePicker.js';
import { createResourcePickerPageHost } from '../../lib/resourcePickerPageHost.js';

export type TypeResourcePickerMode = 'select' | 'routedDialog';

declare module 'zova-module-a-openapi' {
  export interface IResourceFormFieldRecord {
    'basic-resource:formFieldResourcePicker'?: IResourceFormFieldResourcePickerOptions;
  }
}

export interface IResourceFormFieldResourcePickerOptions extends IResourceFormFieldOptionsBase {
  resource?: string;
  actionPath?: string;
  query?: ITableQuery;
  relationName?: string;
  selectOptions?: ZSelectProps;
  pickerMode?: TypeResourcePickerMode;
  selectionMode?: TypeResourcePickerSelectionMode;
  selectionMax?: number;
}

export interface ControllerFormFieldResourcePickerProps extends IFormFieldComponentOptions {
  options?: IResourceFormFieldResourcePickerOptions;
}

@Controller()
export class ControllerFormFieldResourcePicker extends BeanControllerBase {
  static $propsDefault = {
    options: { selectOptions: { itemValue: 'id', itemTitle: 'name' } },
  };

  static $componentOptions: IComponentOptions = { inheritAttrs: false, deepExtendDefault: true };

  $$modelResource: ModelResource;
  private _openingDialog = false;
  private _pendingLabelIds = new Set<string>();
  private _labelHydrationAttemptedIds = new Set<string>();

  @Use({ injectionScope: 'host' })
  $$renderContext: IJsxRenderContextFormField;

  protected async __init__() {
    const { ctx } = this.$$renderContext;
    if (this.$props.readonly || this.pickerMode === 'routedDialog') return;
    this.$$modelResource = await ctx.bean._getBeanSelector(
      'rest-resource.model.resource',
      true,
      this.resource,
    );
    await $QueryEnsureLoaded(() => this.queryData);
  }

  get resource() {
    const resource = this.resourcePickerOptions?.resource;
    if (!resource) throw new Error('should specify resource name');
    return resource;
  }

  get resourcePickerOptions() {
    return this.$props.options;
  }

  get pickerMode(): TypeResourcePickerMode {
    return this.resourcePickerOptions?.pickerMode ?? 'select';
  }

  get selectionMode(): TypeResourcePickerSelectionMode {
    return this.resourcePickerOptions?.selectionMode ?? 'single';
  }

  get queryData() {
    return this.$$modelResource.selectGeneral(
      this.resourcePickerOptions?.actionPath,
      this.resourcePickerOptions?.query,
    );
  }

  get items() {
    return Array.isArray(this.queryData.data) ? this.queryData.data : this.queryData.data?.list;
  }

  protected render() {
    if (this.$props.readonly) {
      return (
        <ZFormFieldPreset
          {...this.$props}
          render="basic-input:formFieldInput"
          options={{ value: this._getValueByRelation() }}
        ></ZFormFieldPreset>
      );
    }
    if (this.pickerMode === 'routedDialog') return this._renderRoutedDialogField();
    return this._renderSelectField();
  }

  private _renderSelectField() {
    return (
      <ZFormField
        {...this.$props}
        slotDefault={({ propsBucket, props }, $$formField) => {
          const needClearableEmptyOption = !propsBucket.needHandleBorder;
          const className = needClearableEmptyOption
            ? classes(
                props.class,
                'grow w-full h-full min-h-0 border-0 rounded-none bg-transparent pl-0 pr-8 py-0 shadow-none outline-none focus:outline-none focus:shadow-none focus:border-0',
              )
            : classes(
                props.class,
                'select',
                !$$formField.field.state.meta.isValid && 'select-error',
              );
          const propsNew: ZSelectProps = {
            'modelValue': propsBucket.value,
            'onUpdate:modelValue': (value: any) => {
              $$formField.setValue(value, propsBucket.disableNotifyChanged);
            },
            'onBlur': () => {
              $$formField.handleBlur();
            },
            'items': this.items,
            ...this.$props.options?.selectOptions,
            ...propsBucket.options?.selectOptions,
            ...props,
            'class': className,
          };
          if (needClearableEmptyOption) {
            propsNew.items = this._ensureEmptyItemFallback(
              propsNew.items,
              propsNew.placeholder,
              true,
            );
            propsNew.placeholder = undefined;
          } else if (!propsNew.placeholder) {
            propsNew.items = this._ensureEmptyItemFallback(propsNew.items, undefined);
          }
          return <ZSelect {...propsNew}></ZSelect>;
        }}
      ></ZFormField>
    );
  }

  private _renderRoutedDialogField() {
    return (
      <ZFormField
        {...this.$props}
        slotDefault={({ propsBucket, props }, $$formField) => {
          const className = !propsBucket.needHandleBorder
            ? classes(
                props.class,
                'grow w-full h-full min-h-0 border-0 rounded-none bg-transparent px-0 py-0 text-left outline-none',
              )
            : classes(props.class, 'input', !$$formField.field.state.meta.isValid && 'input-error');
          return (
            <button
              {...props}
              type="button"
              class={className}
              onBlur={() => $$formField.handleBlur()}
              onClick={() => {
                void this._openPicker(propsBucket.value, value => {
                  $$formField.setValue(value, propsBucket.disableNotifyChanged);
                }).catch(error => {
                  this.$errorHandler(error, 'ControllerFormFieldResourcePicker.openPicker');
                });
              }}
            >
              {this._formatPickerValue(propsBucket.value) || this.scope.locale.PleaseSelect()}
            </button>
          );
        }}
      ></ZFormField>
    );
  }

  private async _openPicker(value: unknown, setValue: (value: unknown) => void) {
    if (this._openingDialog) return;
    this._openingDialog = true;
    try {
      const selectedIds = normalizeResourcePickerIds(value);
      const options: IResourcePickerPageOptions = {
        resource: this.resource,
        actionPath: this.resourcePickerOptions?.actionPath,
        query: this.resourcePickerOptions?.query,
        selectionMode: this.selectionMode,
        selectionMax: this.resourcePickerOptions?.selectionMax,
        selectedIds,
      };
      const session: IResourcePickerPageSession = {
        selectedIds: [...selectedIds],
        selectedRows: [],
      };
      const handle = this.$appModal.routedDialog<
        IResourceTableSelectionPayload,
        IResourcePickerPageOptions,
        IResourcePickerPageSession
      >({
        route: {
          name: 'rest-resource:resourcePicker',
          params: { resource: this.resource },
        },
        props: options,
        session,
        createPageHostProviders: dialog => ({
          [resourcePickerPageHostKey]: createResourcePickerPageHost(dialog),
        }),
      });
      const result = await handle.result;
      if (!result) return;
      const nextValue = resolveResourcePickerValue(
        result.ids,
        this.selectionMode,
        resolvePickerSelectionMax(this.selectionMode, this.resourcePickerOptions?.selectionMax),
      );
      this._syncRelationField(nextValue, result.rows);
      setValue(nextValue);
    } finally {
      this._openingDialog = false;
    }
  }

  private _formatPickerValue(value: unknown) {
    const selectedIds = normalizeResourcePickerIds(value);
    if (selectedIds.length === 0) return '';
    const relationItems = this._getRelationItems();
    const relationMap = new Map(
      relationItems.map(item => [String(item.id as TableIdentity), item] as const),
    );
    const itemTitle = this._itemTitle;
    const missingIds = selectedIds.filter(id => {
      const item = relationMap.get(String(id));
      return (
        (item?.[itemTitle] === undefined || item[itemTitle] === null) &&
        !this._labelHydrationAttemptedIds.has(String(id))
      );
    });
    if (missingIds.length > 0) {
      void this._hydrateMissingLabels(missingIds);
    }
    return selectedIds
      .map(id => {
        const title = relationMap.get(String(id))?.[itemTitle];
        return title === undefined || title === null ? String(id) : String(title);
      })
      .join(', ');
  }

  private _getValueByRelation() {
    const item = this._getRelationItems()[0];
    return item?.[this._itemTitle];
  }

  private get _itemTitle() {
    return String(this.resourcePickerOptions?.selectOptions?.itemTitle ?? 'name');
  }

  private get _relationName() {
    const relationName = this.resourcePickerOptions?.relationName;
    if (relationName) return relationName;
    const fieldName = this.$props.name;
    const index = fieldName?.lastIndexOf('Id') ?? -1;
    return index > 0 ? fieldName!.substring(0, index) : undefined;
  }

  private _getRelationItems() {
    const relationName = this._relationName;
    if (!relationName) return [] as Record<string, unknown>[];
    const value = this.$$renderContext.$$form.getFieldValue(relationName as never);
    const items = Array.isArray(value) ? value : value ? [value] : [];
    return items.filter(item => !!item && typeof item === 'object') as Record<string, unknown>[];
  }

  private _syncRelationField(value: unknown, rows: readonly Record<string, unknown>[]) {
    const relationName = this._relationName;
    if (!relationName) return;
    const selectedIds = normalizeResourcePickerIds(value);
    const itemTitle = this._itemTitle;
    const rowMap = new Map(
      this._getRelationItems().map(item => [String(item.id as TableIdentity), item] as const),
    );
    for (const row of rows) {
      const id = row.id as TableIdentity;
      if (id === undefined || id === null || id === '') continue;
      const title = row[itemTitle];
      if (title === undefined || title === null) continue;
      rowMap.set(String(id), { id, [itemTitle]: title });
    }
    const relationItems = selectedIds.map(id => rowMap.get(String(id)) ?? { id });
    const relationValue = this.selectionMode === 'multiple' ? relationItems : relationItems[0];
    this.$$renderContext.$$form.setFieldValue(relationName as never, relationValue, true);
  }

  private async _hydrateMissingLabels(ids: readonly TableIdentity[]) {
    const relationName = this._relationName;
    if (!relationName) return;
    const idsToLoad = ids.filter(id => {
      const key = String(id);
      if (this._pendingLabelIds.has(key) || this._labelHydrationAttemptedIds.has(key)) return false;
      this._pendingLabelIds.add(key);
      this._labelHydrationAttemptedIds.add(key);
      return true;
    });
    if (idsToLoad.length === 0) return;
    try {
      const model = (await this.bean._getBeanSelector(
        'rest-resource.model.resource',
        true,
        this.resource,
      )) as ModelResource;
      const rows = await Promise.all(
        idsToLoad.map(async id => {
          const result = await model.view(id).refetch();
          return result.data;
        }),
      );
      const currentIds = normalizeResourcePickerIds(
        this.$$renderContext.$$form.getFieldValue(this.$props.name as never),
      );
      this._syncRelationField(currentIds, rows.filter(Boolean) as Record<string, unknown>[]);
    } catch (error) {
      this.$errorHandler(error, 'ControllerFormFieldResourcePicker.hydrateMissingLabels');
    } finally {
      for (const id of idsToLoad) {
        this._pendingLabelIds.delete(String(id));
      }
    }
  }

  private _ensureEmptyItemFallback(
    items: any[] | undefined,
    placeholder: unknown,
    force = false,
  ): any[] | undefined {
    if (!items?.length) return items;
    const valueKey = String(this.$props.options.selectOptions!.itemValue);
    const titleKey = String(this.$props.options.selectOptions!.itemTitle);
    const emptyValue = '';
    if (items[0]?.[valueKey] === emptyValue) return items;
    if (!force && !!placeholder) return items;
    return [{ [valueKey]: emptyValue, [titleKey]: placeholder ?? '' }, ...items];
  }
}
