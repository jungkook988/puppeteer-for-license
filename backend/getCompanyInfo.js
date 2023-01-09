const { pageDelay } = require("./utils.js");

module.exports = getCompanyInfo = async (browser, page, list) => {
  const result = [];

  // 访问天眼查地址
  await page.goto("https://www.tianyancha.com/company");

  // 循环遍历查询
  list.map(async (name) => {
    console.log(name);
    // 输入企业名称
    await page.type("#header-company-search", name, {
      delay: 0,
    });

    await pageDelay(500);

    const company = await page.waitForSelector("#suggest_eventId_0");

    // 准备获取新窗口的监听函数
    const newPagePromise = new Promise((res) =>
      browser.once("targetcreated", (target) => {
        res(target.page());
      })
    );

    // 点击模糊搜索第一项
    await company.click();

    // 获取新窗口Page以及新窗口URL
    const newPage = await newPagePromise;
    const newPageUrl = await newPage.url();
    await newPage.goto(`${newPageUrl}/jingzhuang`);

    await pageDelay(500);

    // 获取行政许可文本
    const licenseColumn = await newPage.$$eval(".left-col", (element) => {
      return element.map((ele) => ele.innerText);
    });

    const isHave = licenseColumn.find((e) => {
      return e.indexOf("人力资源服务") == 0;
    });

    if (isHave) result.push(name);

    await newPage.close();
  });

  console.log(result);
};
