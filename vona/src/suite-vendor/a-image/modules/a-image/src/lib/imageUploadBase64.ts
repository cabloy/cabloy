import { fileTypeFromBuffer } from 'file-type';
import path from 'node:path';

export const imageUploadBase64MaxSize = 2 * 1024 * 1024;
export const imageUploadBase64MaxLength = 4 * Math.ceil(imageUploadBase64MaxSize / 3);
export const imageUploadBase64MimeTypes = ['image/png', 'image/jpeg', 'image/webp'] as const;

export async function decodeImageUploadBase64(data: {
  base64: string;
  mimeType: string;
  filename: string;
}) {
  if (
    !data.base64.length ||
    data.base64.length > imageUploadBase64MaxLength ||
    data.base64.length % 4 !== 0 ||
    !/^[a-z0-9+/]+={0,2}$/i.test(data.base64)
  ) {
    throw new Error('Invalid image base64');
  }
  const buffer = Buffer.from(data.base64, 'base64');
  if (
    !buffer.length ||
    buffer.length > imageUploadBase64MaxSize ||
    buffer.toString('base64') !== data.base64
  ) {
    throw new Error('Invalid image base64 size or encoding');
  }
  const type = await fileTypeFromBuffer(buffer).catch(() => undefined);
  if (
    !type ||
    !imageUploadBase64MimeTypes.includes(type.mime as any) ||
    type.mime !== data.mimeType
  ) {
    throw new Error('Image content does not match the supported mimeType');
  }
  const filename = path.posix.basename(data.filename.replace(/\\/g, '/'));
  const extension = path.extname(filename).toLowerCase();
  const extensions = type.mime === 'image/jpeg' ? ['.jpg', '.jpeg'] : [`.${type.ext}`];
  if (
    !filename ||
    [...filename].some(
      character => character.charCodeAt(0) < 32 || character.charCodeAt(0) === 127,
    ) ||
    !extensions.includes(extension)
  ) {
    throw new Error('Image filename does not match the content type');
  }
  return { buffer, filename, mimeType: type.mime };
}
