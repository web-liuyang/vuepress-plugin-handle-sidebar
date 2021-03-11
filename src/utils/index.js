const fs = require('fs');
const path = require('path');

/**
 * @description 正则
 * @type {object}
 */
const REG_VALID = {
  FILENAME_FIRST: /^\./,
  FILENAME_EXTENSION: /\.md$/,
  FILEROOT: /^src/,
};

/**
 * @description 把数组中相同的key值的数组合并成obj类型
 * @param {array} array - 数组
 * @param {string} key - key值
 */
function mergeSameKeyToObject(array, key) {
  const obj = {};
  array.forEach((item) => {
    if (!obj[item[key]]) {
      obj[item[key]] = [];
    }
    obj[item[key]].push(item);
  });

  return obj;
}

/**
 * @description 生成侧边栏数据
 * @param { object } obj - mergeSameKeyToObject函数生成的数据
 * @param { object } options - 用户参数传递
 */
function generateSidebar(obj, options) {
  const target = {};
  for (const k in obj) {
    const title = k.split('/');
    target[k] = [
      {
        title: title[title.length - 2],
        collapsable: options.collapsable,
        sidebarDepth: options.sidebarDepth,
        children: obj[k].map(({ filename }) => (filename === 'README' ? '' : filename)),
      },
    ];
  }

  return target;
}

/**
 * @description 读取文件信息
 */
function getFileinfo(jsonPath, filesinfo = []) {
  const filename = fs.readdirSync(jsonPath, { withFileTypes: true }); // 获取目录下的所有文件
  filename.forEach((item) => {
    if (REG_VALID.FILENAME_FIRST.test(item.name)) return; // 如果是以.开头的字符串那么返回
    // 判断当前是否为目录
    if (item.isDirectory()) {
      getFileinfo(path.join(jsonPath, item.name), filesinfo);
    }
    // 判断是否为md文件
    if (REG_VALID.FILENAME_EXTENSION.test(item.name)) {
      const [filename, extensionname] = item.name.split('.');
      const filedir = jsonPath.replace(REG_VALID.FILEROOT, '');
      filedir &&
        filesinfo.push({
          filedir: filedir + '/',
          filename,
          extensionname,
        });
    }
  });
  return filesinfo;
}

/**
 * @description 标题样式
 * @param { object } sidebar - sidebar信息
 * @param { object } options - 用户参数传递
 */
function handleTitleMode(sidebar, options) {
  let evalMethed = 'toLowerCase()';
  switch (options.titleMode) {
    case 'lowerCase':
      evalMethed = 'toLowerCase()';
      break;
    case 'upperCase':
      evalMethed = 'toUpperCase()';
      break;
    case 'firstUpperCase':
      evalMethed = 'replace(sidebar[k][0].title[0], sidebar[k][0].title[0].toUpperCase())';
      break;
    case 'firstLowerCase':
      evalMethed = 'replace(sidebar[k][0].title[0], sidebar[k][0].title[0].toLowerCase())';
      break;
  }
  for (const k in sidebar) {
    eval(`sidebar[k][0].title = sidebar[k][0].title.${evalMethed}`);
  }
  return sidebar;
}

module.exports.getSidebar = function (options) {
  const fileinfo = getFileinfo('src');
  const samePath = mergeSameKeyToObject(fileinfo, 'filedir');
  let sidebar = generateSidebar(samePath, options);
  sidebar = handleTitleMode(sidebar, options);

  if (options.handleSidebar) sidebar = options.handleSidebar(sidebar) || sidebar;
  return sidebar;
};
