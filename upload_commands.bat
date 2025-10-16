@echo off
echo 正在推送代码到GitHub...
git push -u origin main
echo.
echo 推送完成！
echo.
echo 接下来请：
echo 1. 访问 https://github.com/jmcgillcode/online-toolkit
echo 2. 进入 Settings -> Pages
echo 3. 选择 Source: Deploy from a branch
echo 4. 选择 Branch: main, Folder: / (root)
echo 5. 点击 Save
echo.
echo 几分钟后你的网站将在以下地址可用：
echo https://jmcgillcode.github.io/online-toolkit/
echo.
pause