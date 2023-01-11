# Puppeteer for License

> （仅作学习用途！！！）使用 Puppeteer 爬虫采集天眼查拥有人力资源服务许可证的企业。

### 一、选择市区

打开 [https://ggfw.hrss.gd.gov.cn/rlzyh/radowAction.do?method=doEvent&pageModel=pages.homepage.LoginFirstAll] 网址，根据线上网址的选项计算指针需要移动的次数。

打开 ./backend/getCompanyList.js

分别修改市区的 `await page.keyboard.press("ArrowDown");` 的次数。

### 二、文件命名和保存路径

打开 ./backend/core.js

修改 `await exportXlsx(companyInfo, "人力资源许可企业-从化区", "./data");` 中第二个参数和第三个参数。

### 三、运行程序

运行 npm/pnpm/yarn run dev

### 四、滑动验证

由于极验滑动验证返回的图片是打乱的，考虑到时间因素，没有继续实现自动滑动验证，而是改为手动验证。

### 2023/1/11 -> TODO

继续完善滑动验证的自动化实现，思路有二：

- 1. 分别获取完整验证图和缺口验证图（拼接）进行比较，获取到象素差，计算滑块需要移动的距离，通过 Puppeteer 的 Class Mouse 操控滑块；
- 2. 分析 JS 文件，获取缺口验证图信息，计算滑块需要移动的距离，通过 Puppeteer 的 Class Mouse 操控滑块。
