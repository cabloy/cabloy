import type { IComponentOptions } from 'zova';
import type { ControllerFormField, IFormFieldComponentOptions } from 'zova-module-a-form';
import type {
  IResourceFormFieldOptionsBase,
  ISchemaObjectExtensionField,
  ISchemaObjectExtensionFieldDetail,
} from 'zova-module-a-openapi';

import { classes } from 'typestyle';
import { BeanControllerBase } from 'zova';
import { Controller } from 'zova-module-a-bean';
import { ZFormField } from 'zova-module-a-form';

interface IDetailRecord {
  id?: any;
  deleted?: boolean;
  [key: string]: any;
}

const DetailSystemFieldNames = new Set(['id', 'iid', 'deleted', 'createdAt', 'updatedAt']);

declare module 'zova-module-a-openapi' {
  export interface IResourceFormFieldRecord {
    'basic-form:formFieldRelationDetail'?: IResourceFormFieldRelationDetailOptions;
  }
}

export interface IResourceFormFieldRelationDetailOptions extends IResourceFormFieldOptionsBase {
  detail?: ISchemaObjectExtensionFieldDetail;
}

export interface ControllerFormFieldRelationDetailProps extends IFormFieldComponentOptions {
  options?: IResourceFormFieldRelationDetailOptions;
}

@Controller()
export class ControllerFormFieldRelationDetail extends BeanControllerBase {
  static $propsDefault = {};
  static $componentOptions: IComponentOptions = { inheritAttrs: false, deepExtendDefault: true };

  protected async __init__() {}

  protected render() {
    const propsFormField = this.$props as ControllerFormFieldRelationDetailProps;
    return (
      <ZFormField
        {...propsFormField}
        slotDefault={({ propsBucket, props }, $$formField: ControllerFormField) => {
          const property = $$formField.property as ISchemaObjectExtensionField | undefined;
          const detail = propsBucket.options?.detail ?? property?.rest?.detail;
          const rows = this._normalizeRows(propsBucket.value);
          const readonly = !!propsBucket.readonly || detail?.readonly === true;
          const columns = this._getColumns(property);
          const title = property?.title ?? detail?.relation ?? propsBucket.name;
          return (
            <div class={classes('rounded-box border border-base-300 bg-base-100', props.class)}>
              <div class="flex items-center justify-between border-b border-base-300 px-4 py-3">
                <div>
                  <div class="font-medium">{title}</div>
                  <div class="text-sm text-base-content/60">
                    {this._getSummary(detail, rows.length, readonly)}
                  </div>
                </div>
                {!readonly && detail?.cardinality === 'many' && (
                  <button
                    type="button"
                    class="btn btn-sm btn-outline"
                    onClick={() => {
                      $$formField.setValue(
                        [...rows, this._createRow(property)],
                        propsBucket.disableNotifyChanged,
                      );
                      $$formField.handleBlur();
                    }}
                  >
                    {this.scope.locale.AddDetail()}
                  </button>
                )}
              </div>
              {rows.length === 0 ? (
                <div class="px-4 py-4 text-sm text-base-content/50">
                  {this.scope.locale.NoDetailData()}
                </div>
              ) : (
                <div class="overflow-x-auto">
                  <table class="table table-sm">
                    <thead>
                      <tr>
                        {columns.map(column => (
                          <th key={column.key}>{column.title}</th>
                        ))}
                        {!readonly && (
                          <th class="w-24 text-right">{this.scope.locale.Operations()}</th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {rows.map((row, index) => {
                        return (
                          <tr key={String(row.id ?? index)}>
                            {columns.map(column => (
                              <td key={column.key}>
                                {this._renderCell(
                                  rows,
                                  row,
                                  index,
                                  column,
                                  readonly,
                                  propsBucket.disableNotifyChanged,
                                  $$formField,
                                )}
                              </td>
                            ))}
                            {!readonly && (
                              <td class="text-right">
                                <button
                                  type="button"
                                  class="btn btn-xs btn-ghost text-error"
                                  onClick={() => {
                                    const rowsNew = rows.slice();
                                    rowsNew.splice(index, 1);
                                    $$formField.setValue(rowsNew, propsBucket.disableNotifyChanged);
                                    $$formField.handleBlur();
                                  }}
                                >
                                  {this.scope.locale.RemoveDetail()}
                                </button>
                              </td>
                            )}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          );
        }}
      ></ZFormField>
    );
  }

  private _normalizeRows(value: unknown): IDetailRecord[] {
    if (!Array.isArray(value)) return [];
    return value.filter(item => !!item && typeof item === 'object') as IDetailRecord[];
  }

  private _getColumns(property?: ISchemaObjectExtensionField) {
    const properties =
      property?.items && 'properties' in property.items ? property.items.properties : undefined;
    if (!properties) return [];
    return Object.keys(properties)
      .filter(key => !DetailSystemFieldNames.has(key))
      .map(key => {
        const columnProperty = properties[key] as ISchemaObjectExtensionField;
        return {
          key,
          title: columnProperty.title ?? key,
          property: columnProperty,
        };
      });
  }

  private _renderCell(
    rows: IDetailRecord[],
    row: IDetailRecord,
    index: number,
    column: { key: string; title: string | undefined; property: ISchemaObjectExtensionField },
    readonly: boolean,
    disableNotifyChanged: boolean | undefined,
    $$formField,
  ) {
    const value = row[column.key];
    if (readonly) {
      return this._renderCellValue(value, column.property);
    }
    const enumOptions = this._getEnumOptions(column.property);
    if (enumOptions) {
      return (
        <select
          class="select select-sm select-bordered w-full"
          value={value == null ? '' : String(value)}
          onChange={e => {
            const rowsNew = rows.slice();
            rowsNew[index] = { ...row, [column.key]: (e.target as HTMLSelectElement).value };
            $$formField.setValue(rowsNew, disableNotifyChanged);
            $$formField.handleBlur();
          }}
        >
          <option value=""></option>
          {enumOptions.map(item => (
            <option key={String(item)} value={String(item)}>
              {String(item)}
            </option>
          ))}
        </select>
      );
    }
    return (
      <input
        type={this._getInputType(column.property)}
        class="input input-sm input-bordered w-full"
        value={value == null ? '' : String(value)}
        onInput={e => {
          const target = e.target as HTMLInputElement;
          const rowsNew = rows.slice();
          rowsNew[index] = {
            ...row,
            [column.key]: this._normalizeInputValue(target.value, column.property),
          };
          $$formField.setValue(rowsNew, disableNotifyChanged);
        }}
        onBlur={() => {
          $$formField.handleBlur();
        }}
      />
    );
  }

  private _renderCellValue(value: unknown, property?: ISchemaObjectExtensionField) {
    if (value === undefined || value === null || value === '') return '-';
    if (Array.isArray(value)) return value.join(', ');
    if (typeof value === 'object') return JSON.stringify(value);
    if (property?.enum) return String(value);
    return String(value);
  }

  private _getInputType(property?: ISchemaObjectExtensionField) {
    return property?.type === 'integer' || property?.type === 'number' ? 'number' : 'text';
  }

  private _normalizeInputValue(value: string, property?: ISchemaObjectExtensionField) {
    if (value === '') return undefined;
    if (property?.type === 'integer') return Number.parseInt(value);
    if (property?.type === 'number') return Number.parseFloat(value);
    return value;
  }

  private _getEnumOptions(property?: ISchemaObjectExtensionField) {
    return Array.isArray(property?.enum) && property.enum.length > 0 ? property.enum : undefined;
  }

  private _getSummary(
    detail: ISchemaObjectExtensionFieldDetail | undefined,
    count: number,
    readonly: boolean,
  ) {
    const mode = readonly ? this.scope.locale.ReadonlyDetail() : this.scope.locale.EditableDetail();
    return `${detail?.layout ?? 'table'} · ${count} · ${mode}`;
  }

  private _createRow(property?: ISchemaObjectExtensionField): IDetailRecord {
    const row: IDetailRecord = {};
    const properties =
      property?.items && 'properties' in property.items ? property.items.properties : undefined;
    if (!properties) return row;
    for (const key of Object.keys(properties)) {
      if (DetailSystemFieldNames.has(key)) continue;
      row[key] = undefined;
    }
    return row;
  }
}
