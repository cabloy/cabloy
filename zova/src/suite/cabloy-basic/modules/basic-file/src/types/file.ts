import type { TableIdentity } from 'table-identity';

export interface IFilePreviewItem {
  id: TableIdentity;
  filename?: string;
  contentType?: string;
  size?: number;
  uploadedAt?: string | Date;
  downloadUrl?: string;
  public?: boolean;
  signed?: boolean;
}
