import { BeanBase } from 'vona';
import { FileScene } from 'vona-module-a-file';

@FileScene({
  provider: {
    providerName: 'file-cloudflare:cloudflare',
    clientName: 'default',
  },
  upload: {
    maxSize: 2 * 1024 * 1024,
    mimeTypes: ['text/plain'],
    public: false,
  },
})
export class FileSceneCloudflareFile extends BeanBase {}
