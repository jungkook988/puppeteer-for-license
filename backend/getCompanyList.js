const { pageDelay } = require("./utils.js");

module.exports = getCompanyList = async (page) => {
  // 访问人力资源政务地址
  await page.goto(
    "https://ggfw.hrss.gd.gov.cn/rlzyh/radowAction.do?method=doEvent&pageModel=pages.homepage.LoginFirstAll"
  );

  await page.waitForSelector("#bba901_combo");
  // 选择市级选项（广州市）
  await page.focus("#bba901_combo");
  await page.keyboard.press("ArrowDown");
  await pageDelay(500);
  await page.keyboard.press("Enter");

  await pageDelay(500);

  // 选择区级选项
  await page.focus("#bba900_combo");
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("ArrowDown");
  await pageDelay(500);
  await page.keyboard.press("Enter");

  // 获取查询按钮并点击
  const searchButton = await page.waitForSelector("#ext-gen27");
  await searchButton.click();

  await pageDelay(500);

  // 获取企业名称数组
  const name = [];
  const getCompanyName = async () => {
    await pageDelay(500);
    await page.waitForSelector(".x-grid3-cell-inner");
    const nameList = await page.evaluate(() => {
      const tds = Array.from(
        document.querySelectorAll(
          "#ext-gen36 .x-grid3-td-3 .x-grid3-cell-inner"
        )
      );
      return tds.map((td) => td.innerText);
    });

    // 数据合并
    await new Promise((resolve) => {
      resolve(name.push(...nameList));
    });

    // 获取下一页文本
    const nextPageButton = await page.$("#ext-gen62");
    let currentPage = await page.evaluate(() => {
      const current = document.querySelector("#ext-comp-1016");
      return current.value;
    });

    // 获取总页数
    let totalPage = await page.evaluate(() => {
      const total = document.querySelector("#ext-comp-1017");
      return total.innerText;
    });
    if (totalPage.substring(4, 5) == " ") {
      totalPage = totalPage.substring(3, 4);
    } else {
      totalPage = totalPage.substring(3, 5);
    }

    // 递归执行遍历
    if (currentPage != totalPage) {
      await nextPageButton.click();
      await pageDelay(500);
      await getCompanyName();
    }

    return name;
  };

  return await getCompanyName();
};
