const rGlobalCSSs = require.context('../../../build/__module/', true, /\/dist\/front\.css$/);
rGlobalCSSs.keys().every(key => rGlobalCSSs(key));
