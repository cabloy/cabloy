import { Meta } from 'vona-module-a-meta';
import { BeanStatusBase } from 'vona-module-a-status';

interface IStatusUser {
  name: string;
  age: number;
}

export interface IStatusRecord {
  enable: boolean;
  user: IStatusUser;
}

@Meta()
export class MetaStatus extends BeanStatusBase<IStatusRecord> {}
