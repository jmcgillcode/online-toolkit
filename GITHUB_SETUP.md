# 🚀 GitHub仓库创建和部署指南

## 第一步：创建GitHub仓库

### 1. 访问GitHub
- 打开浏览器，访问：https://github.com/new
- 确保你已登录 `jmcgillcode` 账户

### 2. 填写仓库信息
```
Repository name: online-toolkit
Description: 🛠️ 免费在线工具箱 - 功能丰富的在线工具集合，已集成Google AdSense，完全SEO优化
```

### 3. 设置选项
- ✅ Public（公开仓库）
- ❌ 不要勾选 "Add a README file"
- ❌ 不要勾选 "Add .gitignore"
- ❌ 不要勾选 "Choose a license"

### 4. 点击 "Create repository"

## 第二步：推送本地代码

创建仓库后，在命令行中运行：

```bash
cd "D:\谷歌广告\files"
git push -u origin main
```

## 第三步：启用GitHub Pages

### 1. 进入仓库设置
- 在你的仓库页面点击 "Settings" 标签

### 2. 配置Pages
- 滚动到 "Pages" 部分
- Source 选择 "Deploy from a branch"
- Branch 选择 "main"
- Folder 选择 "/ (root)"
- 点击 "Save"

### 3. 获取网站地址
- 几分钟后，你的网站将在以下地址可用：
- `https://jmcgillcode.github.io/online-toolkit/`

## 第四步：配置AdSense（稍后）

### 1. 申请AdSense
- 访问：https://www.google.com/adsense/
- 使用你的Google账户申请

### 2. 获得批准后
- 编辑文件：`assets/js/ads.js`
- 替换所有 `YOUR_PUBLISHER_ID` 为你的实际发布者ID
- 替换所有 `YOUR_AD_SLOT_ID_X` 为实际广告位ID

## 📊 预期结果

完成后你将拥有：
- ✅ 完整的在线工具箱网站
- ✅ 免费的 .github.io 域名
- ✅ 已集成AdSense广告位
- ✅ 完全SEO优化
- ✅ 移动端友好的响应式设计

## 🎯 接下来的步骤

1. **测试网站** - 确保所有功能正常
2. **提交搜索引擎** - Google Search Console、百度站长工具
3. **申请AdSense** - 开始盈利
4. **添加更多工具** - 扩展功能

## ❓ 需要帮助？

如果遇到任何问题，可以：
1. 检查GitHub仓库是否创建成功
2. 确认本地代码已推送
3. 验证GitHub Pages是否启用
4. 测试网站是否可以访问

**你的项目已经准备就绪，开始赚钱吧！** 🚀💰