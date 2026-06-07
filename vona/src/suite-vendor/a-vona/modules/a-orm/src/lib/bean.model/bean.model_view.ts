import type { ISwapDepsItem } from '@cabloy/deps';
import type { Knex } from 'knex';

import { swapDeps } from '@cabloy/deps';
import { cast } from 'vona';

import { BeanModelKnex } from './bean.model_knex.ts';

export class BeanModelView<TRecord extends {}> extends BeanModelKnex<TRecord> {
  async createView(
    viewName: string,
    callback?: (viewBuilder: Knex.ViewBuilder) => any,
  ): Promise<void> {
    if (callback) {
      // create view
      let _view: Knex.ViewBuilder | null = null;
      await this.schema.createView(viewName, view => {
        _view = view;
        return callback(view);
      });
      // view sql
      const sql = cast(_view).toSQL();
      const viewSql = sql[0].sql;
      // record view
      const viewRecord = await this.modelViewRecord.get({ viewName });
      if (viewRecord) {
        await this.modelViewRecord.update({ id: viewRecord.id, viewSql });
      } else {
        await this.modelViewRecord.insert({ viewName, viewSql });
      }
    } else {
      // get record
      const viewRecord = await this.modelViewRecord.get({ viewName });
      if (!viewRecord) throw new Error(`not found view record: ${viewName}`);
      await this.raw(viewRecord.viewSql);
    }
  }

  async dropView(viewName: string, disableRemoveRecord?: boolean) {
    // drop view: use dropViewIfExists
    await this.schema.dropViewIfExists(viewName);
    // remove record
    if (!disableRemoveRecord) {
      await this.modelViewRecord.delete({ viewName });
    }
  }

  async alterView(
    viewName: string,
    callback?: (viewBuilder: Knex.ViewBuilder) => any,
  ): Promise<void> {
    await this._viewDependentsAll_handle(viewName, async () => {
      // drop view
      await this.dropView(viewName, true);
      // create view
      await this.createView(viewName, callback);
    });
  }

  async createTable(
    tableName: string,
    callback: (tableBuilder: Knex.CreateTableBuilder) => any,
  ): Promise<void> {
    await this.schema.createTable(tableName, callback);
  }

  async dropTable(tableName: string) {
    await this.schema.dropTable(tableName);
  }

  async alterTable(
    tableName: string,
    callback: (tableBuilder: Knex.CreateTableBuilder) => any,
    alterViewAuto?: boolean,
  ): Promise<void> {
    if (!alterViewAuto) {
      // alter table
      return await this.schema.alterTable(tableName, table => {
        return callback(table);
      });
    }
    await this._viewDependentsAll_handle(tableName, async () => {
      await this.schema.alterTable(tableName, table => {
        return callback(table);
      });
    });
  }

  async viewDependents(viewName: string): Promise<string[]> {
    // builder
    const builder = this.builder();
    // dialect
    return await this.dialect.viewDependents(builder, viewName);
  }

  async viewDependentsAll(viewName: string): Promise<string[]> {
    // views
    const views: ISwapDepsItem[] = [{ name: viewName, dependencies: [] }];
    // dependencies all
    await this._viewDependentsAll_inner(viewName, views);
    // swap
    swapDeps(views);
    // shift
    views.shift();
    // ready
    return views.map(view => view.name);
  }

  private async _viewDependentsAll_inner(viewName: string, views: ISwapDepsItem[]) {
    const dependents = await this.viewDependents(viewName);
    for (const dependent of dependents) {
      // dependencies
      const view = views.find(view => view.name === dependent);
      if (view) {
        const dep = cast(view.dependencies).find(
          dep => dep.toLowerCase() === viewName.toLowerCase(),
        );
        if (!dep) {
          cast(view.dependencies).push(viewName);
        }
      } else {
        views.push({ name: dependent, dependencies: [viewName] });
      }
      // next
      await this._viewDependentsAll_inner(dependent, views);
    }
  }

  private async _viewDependentsAll_handle(viewName: string, callback: () => Promise<void>) {
    // viewDependentsAll
    const viewDependents = await this.viewDependentsAll(viewName);
    // drop dependents
    for (let i = viewDependents.length - 1; i >= 0; i--) {
      const viewDependent = viewDependents[i];
      await this.dropView(viewDependent, true);
    }
    // callback
    await callback();
    // create dependents
    for (const viewDependent of viewDependents) {
      await this.createView(viewDependent);
    }
  }
}
