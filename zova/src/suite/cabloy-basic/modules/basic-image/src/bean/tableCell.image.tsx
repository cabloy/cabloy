import type { IResourceTableCellOptionsBase } from 'zova-module-a-openapi';
import type {
  IJsxRenderContextTableCell,
  ITableCellRender,
  NextTableCellRender,
} from 'zova-module-a-table';

import { classes } from 'typestyle';
import { BeanBase } from 'zova';
import { TableCell } from 'zova-module-a-table';

declare module 'zova-module-a-openapi' {
  export interface IResourceTableCellRecord {
    'basic-image:image'?: ITableCellOptionsImage;
  }
}

export interface ITableCellOptionsImage extends IResourceTableCellOptionsBase {
  size?: number;
  fit?: 'cover' | 'contain';
  relationName?: string;
}

@TableCell<ITableCellOptionsImage>({
  size: 40,
  fit: 'cover',
})
export class TableCellImage extends BeanBase implements ITableCellRender {
  render(
    options: ITableCellOptionsImage,
    renderContext: IJsxRenderContextTableCell,
    next: NextTableCellRender,
  ) {
    const item = this._resolvePreviewItem(options, renderContext, next());
    const previewUrl = item?.url ? this._resolvePreviewUrl(item.url) : undefined;
    if (!previewUrl) return item?.filename ?? next();
    const size = options.size ?? 40;
    const style = {
      ...(options.style as any),
      width: `${size}px`,
      height: `${size}px`,
    } as any;
    return (
      <div
        class={classes('overflow-hidden rounded-box bg-base-200 shrink-0', options.class)}
        style={style}
      >
        <img
          class="h-full w-full object-cover"
          style={{ objectFit: options.fit ?? 'cover' }}
          src={previewUrl}
          alt={item?.filename ?? 'image'}
        />
      </div>
    );
  }

  private _resolvePreviewItem(
    options: ITableCellOptionsImage,
    renderContext: IJsxRenderContextTableCell,
    value: unknown,
  ) {
    const relationItem = this._getRelationPreviewItem(options, renderContext);
    if (relationItem) return relationItem;
    const url = this._normalizeUrl(value);
    if (!url) return undefined;
    return { url };
  }

  private _getRelationPreviewItem(
    options: ITableCellOptionsImage,
    renderContext: IJsxRenderContextTableCell,
  ) {
    const relationName = this._getRelationName(options, renderContext.$celScope.name);
    if (!relationName) return undefined;
    const relationValue = renderContext.cellContext.row.original[relationName];
    const relationItem = Array.isArray(relationValue)
      ? relationValue.find(item => !!item?.url)
      : relationValue;
    if (!relationItem?.url) return undefined;
    return relationItem;
  }

  private _getRelationName(options: ITableCellOptionsImage, fieldName: string) {
    if (options.relationName) return options.relationName;
    if (fieldName.endsWith('Ids')) {
      return `${fieldName.slice(0, -3)}s`;
    }
    if (fieldName.endsWith('Id')) {
      return fieldName.slice(0, -2);
    }
    return undefined;
  }

  private _normalizeUrl(value: unknown) {
    if (Array.isArray(value)) {
      return value.some(item => !!item) ? String(value.find(item => !!item)) : undefined;
    }
    if (!value) return undefined;
    return String(value);
  }

  private _resolvePreviewUrl(url: string) {
    if (!url.startsWith('/api/')) return url;
    const baseURL = this.sys.config.api.baseURL;
    if (!baseURL) return url;
    return `${baseURL.replace(/\/$/, '')}${url}`;
  }
}
