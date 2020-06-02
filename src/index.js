/**
 * Quasar App Extension index/runner script
 * (runs on each dev/build)
 *
 * API: https://github.com/quasarframework/quasar/blob/master/app/lib/app-extension/IndexAPI.js
 */

const { green } = require('chalk')

const extendConf = function (conf) {
  // make sure qfilterconfigurator boot file is registered
  conf.boot.push('~quasar-app-extension-q-filter-configurator/src/boot/q-filter-configurator.js')
  console.log(green(' App ·') + ' Extension (q-filter-configurator: Adding q-filter-configurator boot reference to your quasar.conf.js')

  // make sure boot & component files transpile
  conf.build.transpileDependencies.push(/quasar-app-extension-q-filter-configurator[\\/]src/)
}

module.exports = function (api) {
  // register JSON api
  api.registerDescribeApi('QFilterConfigurator', './component/QFilterConfigurator.json')

  // extend quasar.conf
  api.extendQuasarConf(extendConf)
}
