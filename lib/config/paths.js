'use strict';

const fs = require('fs');
const path = require('path');

const cwd = process.env.GUIDO_CWD || process.cwd();
const appDirectory = fs.realpathSync(cwd);

function resolveOwn(relativePath) {
	return path.resolve(__dirname, '../..', relativePath);
}
function resolveApp(relativePath) {
	return path.resolve(appDirectory, relativePath);
}

module.exports = {
	ownPath: resolveOwn('.'),
	ownNodeModules: resolveOwn('node_modules'),

	appPath: resolveApp('.'),
	appNodeModules: resolveApp('node_modules'),
	appPackageJson: resolveApp('package.json'),
	appWebpackConfig: resolveApp('webpack.config.js'),
	appSrc: resolveApp('src'),
	appSrcPages: resolveApp('src/pages'),
	appDist: resolveApp('dist'),
	appDistScript: resolveApp('dist/js'),
	appDistStyle: resolveApp('dist/css'),
	appDistImage: resolveApp('dist/images'),
	appDistPages: resolveApp('dist/pages'),
	appDistFont: resolveApp('dist/font'),

	appCache: resolveApp('.cache'),
};
