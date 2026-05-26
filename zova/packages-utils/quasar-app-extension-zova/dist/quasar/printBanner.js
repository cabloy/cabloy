import chalk from 'chalk';
export function printBanner(_context, flavor, delay) {
    return async function printBanner(_conf, api) {
        const mode = api.ctx.prod ? 'production' : 'development';
        const appMode = api.ctx.modeName;
        // log
        if (delay) {
            setTimeout(() => {
                _print(mode, appMode);
            }, 3000);
        }
        else {
            _print(mode, appMode);
        }
    };
    function _print(mode, appMode) {
        // eslint-disable-next-line
        console.log(chalk.yellow('\n============ Zova Meta ============'));
        // eslint-disable-next-line
        console.log(`vite mode ......... ${chalk.cyan(mode)}`);
        // eslint-disable-next-line
        console.log(`app mode .......... ${chalk.cyan(appMode)}`);
        // eslint-disable-next-line
        console.log(`flavor ............ ${chalk.cyan(flavor)}`);
        // eslint-disable-next-line
        console.log('\n');
    }
}
//# sourceMappingURL=printBanner.js.map