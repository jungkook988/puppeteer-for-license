const fs = require("fs");
const path = require("path");
const xlsx = require("xlsx");

// 延时工具函数
const pageDelay = (second) => {
  return new Promise((r) => setTimeout(r, second));
};

// 动态创建文件夹工具函数
const createFolder = (pathname, callback) => {
  // 判断是否为绝对路径
  pathname = path.isAbsolute(pathname)
    ? pathname
    : path.join(__dirname, pathname);

  // 获取相对路径
  pathname = path.relative(__dirname, pathname);

  // path.sep 避免平台带来差异
  const folders = pathname.split(path.sep);

  let pre = ""; // 最终用来拼合的路径

  folders.forEach((folder) => {
    try {
      // 没有异常，文件已创建，提示用户
      const _stat = fs.statSync(path.join(__dirname, pre, folder));
      const hasMkdir = _stat && _stat.isDirectory();
      if (hasMkdir) {
        callback &&
          callback(`文件${floder}已经存在，不能重复创建，请重新创建！`);
      }
    } catch (err) {
      // 抛出异常，文件不存在则创建文件
      try {
        // 避免父文件还没创建时，先创建子文件所出现的意外bug，这里选择同步创建文件
        fs.mkdirSync(path.join(__dirname, pre, folder));
        callback && callback(null);
      } catch (error) {
        callback && callback(null);
      }
    }
    pre = path.join(pre, folder);
  });
};

// 导出Excel工具函数
const exportXlsx = (data, filename, path) => {
  let aoaList = [["公司名称"], data]; // 添加表头
  const workbook = xlsx.utils.book_new();
  const worksheet = xlsx.utils.aoa_to_sheet(aoaList);
  xlsx.utils.book_append_sheet(workbook, worksheet, filename);
  createFolder(path);
  xlsx.writeFile(workbook, `${path}/${filename}.xlsx`);
};

module.exports = {
  pageDelay,
  createFolder,
  exportXlsx,
};
