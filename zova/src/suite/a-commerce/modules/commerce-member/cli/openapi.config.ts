import type { ZovaOpenapiConfigModule } from 'zova-openapi';

export default function (): ZovaOpenapiConfigModule {
  return {
    operations: {
      match: [
        'CommerceMemberAddress_select',
        'CommerceMemberAddress_view',
        'CommerceMemberAddress_mine',
        'CommerceMemberAddress_viewMine',
        'CommerceMemberAddress_createMine',
        'CommerceMemberAddress_updateMine',
        'CommerceMemberAddress_deleteMine',
      ],
    },
  };
}
