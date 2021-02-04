const { getSidebar } = require('./utils');
const { OPTIONS } = require('./utils/config');

module.exports = (options, ctx) => ({
  ready() {
    options = { ...OPTIONS, ...options };
    const sidebar = getSidebar(options);
    ctx.themeConfig.sidebar = sidebar;
  },
});
