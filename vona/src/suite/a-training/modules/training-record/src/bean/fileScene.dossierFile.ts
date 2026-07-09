import { BeanBase } from 'vona';
import { FileScene } from 'vona-module-a-file';

@FileScene({
  public: false,
  upload: {
    maxSize: 20 * 1024 * 1024,
    mimeTypes: [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/zip',
      'application/x-zip-compressed',
      'text/plain',
    ],
    extensions: ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.zip', '.txt'],
    multiple: true,
  },
})
export class FileSceneDossierFile extends BeanBase {}
