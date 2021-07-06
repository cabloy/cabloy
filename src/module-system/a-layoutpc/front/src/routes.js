function load(name) {
  return require(`./pages/${name}.vue`).default;
}

export default [{ path: 'button/clock/preferences', component: load('buttons/buttonClockPreferences') }];
