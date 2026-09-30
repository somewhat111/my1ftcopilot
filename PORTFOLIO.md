# 待辦清單 Web App

這是一個在 GitHub Copilot 實戰工作坊中完成的待辦清單 Web App。專案以純前端技術實作，從基本的待辦管理功能，逐步加入主題切換、篩選與批次清理等實用功能，並透過 GitHub 工作流程管理開發紀錄。

## 線上展示

GitHub Pages：<https://<你的帳號>.github.io/<你的repo名稱>/>

## 功能

- 新增待辦事項，並限制輸入長度。
- 將待辦事項標記為已完成或未完成。
- 刪除單筆待辦事項。
- 顯示整份清單的未完成項目數量。
- 將待辦事項保存至 `localStorage`，重新整理後仍可保留。
- 以「全部」、「未完成」、「已完成」篩選清單。
- 篩選結果為空時，顯示對應的空狀態提示。
- 一次清除所有已完成項目，執行前會顯示瀏覽器確認對話框。
- 沒有已完成項目時，隱藏「清除已完成」按鈕。
- 在淺色與深色模式之間切換，並以 `localStorage` 記住手動選擇。
- 使用者尚未手動選擇主題時，跟隨作業系統的 `prefers-color-scheme` 設定。
- 使用 CSS 變數管理主題配色，並提供基本的響應式版面。
- 為輸入框、勾選框、刪除按鈕與清除按鈕提供相應的無障礙標籤。

## 技術

- 使用純 HTML、CSS 與原生 JavaScript。
- 不使用框架、第三方套件或外部 CDN。
- 以 CSS 變數集中管理配色，支援淺色與深色主題。
- 使用瀏覽器 `localStorage` 保存待辦資料與主題偏好。
- 使用 `createElement`、`textContent` 與 DOM API 建立及更新畫面內容。

## 開發方式

這個專案在 GitHub Copilot 實戰工作坊中，搭配 GitHub Copilot Agent Mode、MCP 與 `.github/prompts` 的 agentic workflow 完成：

- 使用 GitHub Copilot Agent Mode 協助理解需求、探索現有程式碼、提出修改計畫與執行小範圍實作。
- 透過 MCP 連接 Microsoft Learn，查詢 `prefers-color-scheme` 與網頁無障礙色彩對比等官方文件，再對照專案樣式進行檢查。
- 透過 GitHub MCP 讀取 Issue、整理問題、建立修正分支，以及建立包含驗證步驟的 Pull Request。
- 使用 `.github/prompts/fix-issue.prompt.md` 將「讀取 Issue、等待確認、建立分支、修改、驗證、提交推送、建立 PR」整理成可重複使用的 agentic workflow。
- 使用 Git 的分支、commit、rebase 與 push 流程保存每個階段的開發紀錄。

## 我學到什麼

- 如何把功能需求拆成可驗證的小步驟，並在修改前先確認影響範圍。
- 如何使用 CSS 變數與 `prefers-color-scheme` 思考主題切換與色彩對比。
- 如何讓篩選、空狀態、確認對話框與 `localStorage` 狀態保持一致。
- 如何透過 MCP 查詢官方文件與 GitHub Issue，讓開發決策有明確依據。
- 如何設計可重複使用的 Copilot agent prompt，串起 Issue 到 Pull Request 的開發流程。
