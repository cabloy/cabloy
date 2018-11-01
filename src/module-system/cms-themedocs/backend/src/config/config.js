// eslint-disable-next-line
module.exports = appInfo => {
  const config = {};

  // theme
  config.theme = {
    base: {
      title: 'Cabloy',
      subTitle: 'The Ultimate Javascript Full Stack Business Development Platform, based on EggJS & Framework7.',
    },
    _theme: {
      name: 'cms-themedocs',
      url: 'https://github.com/zhennann/egg-born-module-cms-themedocs',
    },
    _github: {
      user: 'zhennann',
      repo: 'cabloy',
    },
    _project: {
      name: 'CabloyJS',
      version: '1.1.1',
      description: 'The Ultimate Javascript Full Stack Business Development Platform, based on EggJS & Framework7.',
      features: [
        'feature1', 'feature2',
      ],
      buttons: [
        { title: 'Github', url: 'https://github.com/zhennann/cabloy' },
        { title: 'Get Started', url: 'https://cabloy.org/articles/get-started.html' },
        { title: 'Demo Online', url: 'https://admin.cabloy.org' },
      ],
    },
    _index: {
      html: '',
      style:
`
section .project{
  color: blue;
}
`,
    },
  };

  return config;
};
