import type { TableIdentityType } from 'table-identity';
import type { VonaApplication } from 'vona';

import knex from 'knex';

import { __ThisModule__ } from '../.metadata/this.ts';

export interface IBasicFieldsOptions {
  id?: boolean;
  timestamps?: boolean;
  deleted?: boolean;
  iid?: boolean;
}

export function ExtendTableBuilder(app: VonaApplication) {
  const scope = app.scope(__ThisModule__);
  function _basicFields(
    this: knex.Knex.TableBuilder,
    options?: IBasicFieldsOptions,
    identityType?: TableIdentityType,
  ) {
    options = options || ({} as IBasicFieldsOptions);
    if (options.id !== false) {
      const _identityType = identityType ?? scope.config.table.identityType;
      if (_identityType === 'bigint') {
        this.bigIncrements();
      } else if (_identityType === 'number') {
        this.increments();
      } else {
        throw new Error('Should create column id by yourself');
      }
    }
    if (options.timestamps !== false) this.timestamps(true, true, true);
    if (options.deleted !== false) this.boolean('deleted').defaultTo(false);
    if (options.iid !== false) this.integer('iid').defaultTo(0);
    return this;
  }

  knex.TableBuilder.extend(
    'basicFields',
    function (this: knex.Knex.TableBuilder, options?: IBasicFieldsOptions) {
      _basicFields.call(this, options, undefined);
      return this;
    },
  );
  knex.TableBuilder.extend(
    'basicFieldsSimple',
    function (this: knex.Knex.TableBuilder, options?: IBasicFieldsOptions) {
      _basicFields.call(this, options, 'number');
      return this;
    },
  );
  knex.TableBuilder.extend(
    'tableIdentity',
    function (this: knex.Knex.TableBuilder, columnName: string) {
      const _identityType = scope.config.table.identityType;
      if (_identityType === 'bigint') {
        return this.bigInteger(columnName); // default value is null
      } else if (_identityType === 'number') {
        return this.integer(columnName); // default value is null
      } else {
        throw new Error(`Should create column ${columnName} by yourself`);
      }
    },
  );
  knex.TableBuilder.extend('userId', function (this: knex.Knex.TableBuilder, columnName?: string) {
    return this.tableIdentity(columnName ?? 'userId');
  });
  knex.TableBuilder.extend('int0', function (this: knex.Knex.TableBuilder, columnName: string) {
    return this.integer(columnName).defaultTo(0);
  });
  knex.TableBuilder.extend('int1', function (this: knex.Knex.TableBuilder, columnName: string) {
    return this.integer(columnName).defaultTo(1);
  });
  ['description'].forEach(method => {
    knex.TableBuilder.extend(method, function (this: knex.Knex.TableBuilder, length: number = 255) {
      return this.string(method, length);
    });
  });
  ['content'].forEach(method => {
    knex.TableBuilder.extend(method, function (this: knex.Knex.TableBuilder, useText?: boolean) {
      return useText ? this.text(method) : this.json(method);
    });
  });
}

declare module 'knex' {
  namespace Knex {
    interface TableBuilder {
      basicFields(options?: IBasicFieldsOptions): Knex.TableBuilder;
      basicFieldsSimple(options?: IBasicFieldsOptions): Knex.TableBuilder;
      tableIdentity(columnName?: string): Knex.ColumnBuilder;
      userId(columnName?: string): Knex.ColumnBuilder;
      int0(columnName: string): Knex.ColumnBuilder;
      int1(columnName: string): Knex.ColumnBuilder;
      description(length?: number): Knex.ColumnBuilder;
      content(useText?: boolean): Knex.ColumnBuilder;
    }
  }
}
