const { getSidebar } = require('./utils');
const { OPTIONS } = require('./utils/config');

module.exports = (options, ctx) => ({
  name: 'vuepress-plugin-handle-sidebar',
  ready() {
    options = { ...OPTIONS, ...options };
    const sidebar = getSidebar(options);
    ctx.themeConfig.sidebar = sidebar;
  },
});
