module.exports = app => {
  const moduleInfo = app.meta.mockUtil.parseInfoFromPackage(__dirname);
  const resources = [
    // cms block
    {
      atomName: 'Audio',
      atomStaticKey: 'blockAudio',
      atomRevision: 0,
      atomCategoryId: 'a-cms:block.General',
      resourceType: 'a-cms:block',
      resourceConfig: JSON.stringify({
        default: {
          audio: {
            name: '',
            url: '',
            artist: '',
            cover: '',
          },
          autoplay: false,
          loop: true,
        },
        validator: {
          module: moduleInfo.relativeName,
          validator: 'blockAudio',
        },
      }),
      resourceRoles: 'root',
    },
    {
      atomName: 'Embed Page',
      atomStaticKey: 'blockIFrame',
      atomRevision: 0,
      atomCategoryId: 'a-cms:block.General',
      resourceType: 'a-cms:block',
      resourceConfig: JSON.stringify({
        default: {
          url: '',
          width: '',
          height: '',
        },
        validator: {
          module: moduleInfo.relativeName,
          validator: 'blockIFrame',
        },
      }),
      resourceRoles: 'root',
    },
  ];
  return resources;
};
