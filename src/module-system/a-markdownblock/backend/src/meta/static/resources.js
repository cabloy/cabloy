const moduleInfo = module.info;

const resources = [
  // markdown block
  {
    atomName: 'Audio',
    atomStaticKey: 'audio',
    atomRevision: 2,
    atomCategoryId: 'a-markdown:block.General',
    resourceType: 'a-markdown:block',
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
    atomStaticKey: 'iframe',
    atomRevision: 2,
    atomCategoryId: 'a-markdown:block.General',
    resourceType: 'a-markdown:block',
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
module.exports = resources;
