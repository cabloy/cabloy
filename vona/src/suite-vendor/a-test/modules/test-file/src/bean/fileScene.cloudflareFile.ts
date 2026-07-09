import { BeanBase } from 'vona';
import { FileScene } from 'vona-module-a-file';

@FileScene({
  provider: {
    providerName: 'file-cloudflare:cloudflare',
    clientName: 'default',
  },
  public: false,
  upload: {
    maxSize: 2 * 1024 * 1024,
    mimeTypes: ['text/plain'],
  },
})
export class FileSceneCloudflareFile extends BeanBase {}
