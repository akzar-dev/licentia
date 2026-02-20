const path = require('path');

module.exports = function customZoomPlugin() {
  return {
    name: 'custom-zoom',
    getClientModules() {
      return [path.resolve(__dirname, '../src/client/custom-zoom.ts')];
    },
  };
};
