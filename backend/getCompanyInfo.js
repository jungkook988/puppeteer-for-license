const login = require("./login.js");
const { pageDelay } = require("./utils.js");

module.exports = getCompanyInfo = async (browser, page, list) => {
  const result = [];

  // 访问天眼查地址
  await page.goto("https://www.tianyancha.com");

  // 检测是否登陆
  await login(page);

  // 循环遍历查询
  for (let name of list) {
    // 输入企业名称并点击跳转
    const searchTopInput = await page.waitForSelector("#header-company-search");
    await searchTopInput.evaluate((el, text) => (el.value = text), name);

    await pageDelay(800);

    await searchTopInput.click();

    await pageDelay(1500);

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

    // 判断是否拥有人力资源服务许可证
    if (isHave) {
      // 获取法人姓名
      const singleName = await newPage.evaluate(() => {
        const singleNameText = document.querySelector(".detailValue > a");
        if (singleNameText) return singleNameText.innerText;
      });
      // 获取联系电话
      const singlePhone = await newPage.evaluate(() => {
        const singlePhoneText = document.querySelector(
          ".index_detail-tel__fgpsE"
        );
        if (singlePhoneText) return singlePhoneText.innerText;
      });
      // 获取办公地址
      const singleAddress = await newPage.evaluate(() => {
        const singleAddressText = document.querySelector(
          ".index_detail-address__ZmaTI"
        );
        if (singleAddressText) return singleAddressText.innerText;
      });
      // 添加数据
      result.push([name, singleName, singlePhone, singleAddress]);
    }

    await newPage.close();
  }

  return result;
};
