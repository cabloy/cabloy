export default {
  ImageController: '图片',
  ImageUploadPolicy: '获取图片上传策略',
  ImageUploadPolicyDescription:
    '读取已注册 imageScene 的有效上传限制、可见性、直传支持，以及可选的客户端裁剪和缩放默认值。处理默认值仅供客户端参考；此调用不会上传、转换或绑定图片，也不会返回供应商配置或凭据。',
  ImageUploadBase64: '上传图片内容',
  ImageUploadBase64Description:
    '通过标准 Base64 上传 PNG、JPEG 或 WebP 图片，解码后最多 2 MiB，并指定已注册的 imageScene。场景决定图片可见性，也可能规定更严格的限制。需要图片上传权限。返回新图片 id 和交付信息，不自动绑定业务记录；重复调用会创建不同图片。',
};
