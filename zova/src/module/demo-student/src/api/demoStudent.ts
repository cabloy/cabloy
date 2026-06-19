import type { TableIdentity } from 'table-identity';

import { Api, BeanApiBase } from 'zova-module-a-api';

export interface IStudentSummary {
  id: TableIdentity;
  name: string;
  level: 1 | 2 | 3;
  levelTitle: string;
  description?: string;
  descriptionLength: number;
  summaryText: string;
}

@Api()
export class ApiDemoStudent extends BeanApiBase {
  summary(id: TableIdentity) {
    return this.$fetch.get<any, IStudentSummary | undefined>(
      this.$pathTranslate('/demo/student/summary/{id}', { id }),
    );
  }

  deleteForce(id: TableIdentity) {
    return this.$fetch.delete<any, void>(
      this.$pathTranslate('/demo/student/deleteForce/{id}', { id }),
    );
  }
}
