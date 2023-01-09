const puppeteer = require("puppeteer");
const getCompanyList = require("./getCompanyList.js");
const getCompanyInfo = require("./getCompanyInfo.js");

// 初始化
(async () => {
  // 打开浏览器
  const browser = await puppeteer.launch({
    headless: false,
    ignoreHTTPSErrors: true,
    defaultViewport: { width: 1440, height: 780 },
  });

  // 新建窗口
  const page = await browser.newPage();

  // 获取企业名称数据
  const companyList = await getCompanyList(page);

  // 新建窗口
  const infoPage = await browser.newPage();

  // 获取企业信息并导出Excel
  await getCompanyInfo(browser, infoPage, companyList);

  // 关闭浏览器
  // await browser.close();
})();
