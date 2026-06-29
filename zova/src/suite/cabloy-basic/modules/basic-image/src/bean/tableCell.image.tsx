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
}

@TableCell<ITableCellOptionsImage>({
  size: 40,
  fit: 'cover',
})
export class TableCellImage extends BeanBase implements ITableCellRender {
  render(
    options: ITableCellOptionsImage,
    _renderContext: IJsxRenderContextTableCell,
    next: NextTableCellRender,
  ) {
    const value = next();
    const url = this._normalizeUrl(value);
    if (!url) return value;
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
          src={this._resolvePreviewUrl(url)}
          alt="image"
        />
      </div>
    );
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
