export default {
  ImageController: 'Images',
  ImageUploadPolicy: 'Get image upload policy',
  ImageUploadPolicyDescription:
    'Read the effective upload limits, visibility, direct-upload support and optional client-side crop/resize defaults for a registered imageScene. Processing defaults are advisory; this call does not upload, transform or bind an image and does not return provider configuration or credentials.',
  ImageUploadBase64: 'Upload image content',
  ImageUploadBase64Description:
    'Upload a PNG, JPEG or WebP image as canonical base64 (at most 2 MiB decoded) under a registered imageScene. The scene controls visibility and may impose stricter limits. Requires image upload permission. Returns the new image id and delivery metadata; does not bind it to a business record. Repeated calls create separate images.',
};
