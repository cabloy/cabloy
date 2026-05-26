import { BeanElectionBase } from 'vona-module-a-election';
import { Meta } from 'vona-module-a-meta';

export type TypeElectionObtainResource = 'hmr';

@Meta()
export class MetaElection extends BeanElectionBase<TypeElectionObtainResource> {}
