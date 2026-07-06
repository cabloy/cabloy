import type { TableIdentity } from 'table-identity';
import type { VonaContext } from 'vona';

import type { DtoRecordDossierFileView } from '../dto/recordDossierFileView.ts';

export async function resolveDossierFiles(
  this: VonaContext,
  _value: unknown,
  data: { dossierFileIds?: TableIdentity[] },
): Promise<DtoRecordDossierFileView[]> {
  const dossierFileIds = data.dossierFileIds;
  if (!dossierFileIds?.length) return [];
  const items: Array<DtoRecordDossierFileView | undefined> = await Promise.all(
    dossierFileIds.map(async dossierFileId => {
      const file = await this.bean.file.get(dossierFileId);
      if (!file || file.fileScene !== 'training-record:dossierFile') return undefined;
      return {
        id: file.id,
        provider: String(file.provider),
        clientName: file.clientName,
        fileScene: file.fileScene ? String(file.fileScene) : undefined,
        filename: file.filename,
        contentType: file.contentType,
        size: file.size,
        public: file.public,
        uploadedAt: file.uploadedAt,
        meta: file.meta as Record<string, unknown> | undefined,
        downloadUrl: await this.bean.file.getDownloadUrl(file.id),
        signed: !file.public,
      } satisfies DtoRecordDossierFileView;
    }),
  );
  return items.filter((item): item is DtoRecordDossierFileView => !!item);
}
