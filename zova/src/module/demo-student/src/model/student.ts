import type { TableIdentity } from 'table-identity';
import type { IDecoratorModelOptions } from 'zova-module-a-model';

import { BeanModelBase, Model } from 'zova-module-a-model';
import { ModelResource } from 'zova-module-rest-resource';

export interface IModelOptionsStudent extends IDecoratorModelOptions {}

export interface IStudentSummary {
  id: TableIdentity;
  name: string;
  level: 1 | 2 | 3;
  levelTitle: string;
  description?: string;
  descriptionLength: number;
  summaryText: string;
}

@Model<IModelOptionsStudent>()
export class ModelStudent extends BeanModelBase {
  expandedSummaryRowId?: TableIdentity;

  private $$modelResource: ModelResource;

  protected async __init__() {
    this.$$modelResource = await this.bean._getBeanSelector(
      'rest-resource.model.resource',
      true,
      'demo-student:student',
    );
    this.expandedSummaryRowId = this.$useStateMem<TableIdentity | undefined>({
      queryKey: ['expandedSummaryRowId'],
      meta: {
        defaultData: undefined,
      },
    });
  }

  summary(id: TableIdentity) {
    return this.$$modelResource.queryItem<IStudentSummary | null>({
      id,
      action: 'summary',
      queryFn: async () => {
        const data = await this.$fetch.get<any, IStudentSummary | undefined>(
          this.sys.util.apiActionPathTranslate(`${this.$$modelResource.resourceApi}/summary/:id`, {
            id,
          }),
          this.sys.util.apiActionConfigPrepare(),
        );
        return data ?? null;
      },
      meta: {
        disableSuspenseOnInit: true,
      },
    });
  }

  deleteForce(id: TableIdentity) {
    return this.$$modelResource.mutationItem<void, void>({
      id,
      action: 'deleteForce',
      mutationFn: async () => {
        return this.$fetch.delete<any, void>(
          this.sys.util.apiActionPathTranslate(
            `${this.$$modelResource.resourceApi}/deleteForce/:id`,
            {
              id,
            },
          ),
          this.sys.util.apiActionConfigPrepare(),
        );
      },
      onSuccess: async () => {
        this.clearExpandedSummary(id);
      },
    });
  }

  isSummaryExpanded(id: TableIdentity) {
    return String(this.expandedSummaryRowId) === String(id);
  }

  toggleSummary(id: TableIdentity) {
    this.expandedSummaryRowId = this.isSummaryExpanded(id) ? undefined : id;
  }

  clearExpandedSummary(id: TableIdentity) {
    if (this.isSummaryExpanded(id)) {
      this.expandedSummaryRowId = undefined;
    }
  }
}
