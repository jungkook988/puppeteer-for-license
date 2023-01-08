const fs = require("fs");
const xlsx = require("xlsx");
const puppeteer = require("puppeteer");

// 初始化
(async () => {
  // 打开浏览器
  const browser = await puppeteer.launch({
    slowMo: 100, //放慢速度
    headless: false,
    ignoreHTTPSErrors: true,
    defaultViewport: { width: 1440, height: 780 },
  });

  // 新建窗口
  const page = await browser.newPage();

  // 访问人力资源政务地址
  await page.goto(
    "https://ggfw.hrss.gd.gov.cn/rlzyh/radowAction.do?method=doEvent&pageModel=pages.homepage.LoginFirstAll"
  );

  // 选择市级选项（广州市）
  await page.focus("#bba901_combo");
  await page.keyboard.press("ArrowDown");
  await new Promise((r) => setTimeout(r, 500));
  await page.keyboard.press("Enter");

  // 选择区级选项（天河区）
  await page.focus("#bba900_combo");
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("ArrowDown");
  await new Promise((r) => setTimeout(r, 500));
  await page.keyboard.press("Enter");

  // 获取查询按钮并点击
  const searchButton = await page.waitForSelector("#ext-gen27");
  searchButton.click();

  await new Promise((r) => setTimeout(r, 500));

  // 获取企业名称数组
  let name = [];
  const getCompanyName = async () => {
    await new Promise((r) => setTimeout(r, 500));
    await page.waitForSelector(".x-grid3-cell-inner");
    const nameList = await page.evaluate(() => {
      const tds = Array.from(
        document.querySelectorAll(
          "#ext-gen36 .x-grid3-td-3 .x-grid3-cell-inner"
        )
      );
      return tds.map((td) => td.innerText);
    });
    name.push(nameList);
    const nextPageButton = await page.$("#ext-gen62");
    let currentPage = await page.evaluate(() => {
      const current = document.querySelector("#ext-comp-1016");
      return current.value;
    });
    let totalPage = await page.evaluate(() => {
      const total = document.querySelector("#ext-comp-1017");
      return total.innerText;
    });
    if (totalPage.substring(4, 5) == " ") {
      totalPage = totalPage.substring(3, 4);
    } else {
      totalPage = totalPage.substring(3, 5);
    }
    if (currentPage != totalPage) {
      await nextPageButton.click();
      await new Promise((r) => setTimeout(r, 500));
      await getCompanyName();
    }
  };

  await getCompanyName();

  console.log(name);
  console.log(name.length);

  // 关闭浏览器
  //   await browser.close();
})();
