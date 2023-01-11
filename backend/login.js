const { pageDelay } = require("./utils");

module.exports = login = async (page) => {
  // 检测用户名
  const userNameSpan = await page.$("#J_NavUserName");

  // 判断是否已有用户名，即登陆
  if (userNameSpan == null) {
    const login = await page.$(
      ".treasure_nav-item__TjRqC > .treasure_nav-link__7ErdH"
    );
    await login.click();
    const loginToggle = await page.$(".login-toggle");
    await loginToggle.click();
    const loginByPwd = await page.$(".title-password");
    await loginByPwd.click();

    await page.type(".sign-password > .phone > input", "13143718588", {
      delay: 100,
    });
    await page.type(".sign-password > .password > input", "SCFD998822", {
      delay: 100,
    });

    const check = await page.$(".login-bottom > input");
    await check.click();
    const loginButton = await page.$(".sign-password > button");
    await loginButton.click();

    // 手动滑动验证
    await pageDelay(10000);
    // 埋个坑，极验滑动验证，暂时无法操作，只能手动代替验证。
    // TODO
    // 思路1：分别获取完整验证图和缺口验证图（拼接）进行比较，获取到象素差，计算滑块需要移动的距离，通过 Puppeteer 的 Class Mouse 操控滑块；
    // 思路2：分析 JS 文件，获取缺口验证图信息，计算滑块需要移动的距离，通过 Puppeteer 的 Class Mouse 操控滑块。

    await page.goto("https://www.tianyancha.com/company");
  }
};
