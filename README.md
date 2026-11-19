# TK3C報價通

「TK3C報價通」目前是 GitHub Pages 上的前端流程原型，供介面驗證與測試使用。公開展示資料均為虛構內容；沒有正式商品、價格、公司貨號或客戶資料來源。

## 技術現況

- 原生 HTML、CSS、JavaScript ES modules，無第三方執行期依賴。
- 靜態部署由 `.github/workflows/pages.yml` 發佈至 GitHub Pages。
- 示範商品與測試流程暫存於目前瀏覽器的 `localStorage`，不會跨瀏覽器或使用者同步。
- PWA manifest 與 service worker 提供安裝資訊及應用程式殼層快取；正式資料仍需伺服器端儲存與權限控管。
- 需求推薦是本機規則式篩選，並未串接 AI 模型。

## 專案結構

```text
index.html                 頁面進入點
manifest.webmanifest       PWA 安裝資訊
sw.js                      靜態殼層離線快取
src/app.js                 現有示範流程與介面
src/catalog.js             商品規格定義、搜尋與類別篩選
src/recommendations.js     本機需求解析與候選評分規則
src/data/demo-products.js  公開展示用虛構商品
src/styles.css             共用及響應式樣式
tests/catalog.test.js      商品搜尋及規格測試
tests/recommendations.test.js 需求解析及候選評分測試
docs/official-product-url-import.md 官方網址匯入可行性與資料正確性評估
.github/workflows/pages.yml GitHub Pages 部署
```

## 開發與測試

使用支援 ES modules 的本機靜態伺服器開啟專案。商品目錄單元測試使用 Node.js 內建測試執行器：

```sh
npm test
```

請勿將客戶資料、內部貨號、成本或其他未獲授權資料放入公開示範版本。商品內容與來源授權必須在正式匯入前逐筆確認。

## 分階段計畫

1. **商品目錄基礎：** 模組化現有頁面、商品類別規格欄位、型號／別名／規格搜尋、響應式檢查與目錄測試。
2. **正式資料治理：** 定義可追溯的商品來源、授權證明、匯入與審核流程；官方網址匯入先依 `docs/official-product-url-import.md` 建立後端及白名單，再以隔離測試資料驗證。
3. **多人正式服務：** 規劃伺服器資料庫、身份驗證、權限、客戶專屬連結、報價分享與成交追蹤，再進行容量及安全驗證。
4. **智慧推薦：** 先驗證需求欄位與評估方式；真正 AI 推薦需完成模型服務串接與結果驗證後才對外標示。

目前的前端原型尚未具備多人資料庫、登入、授權審核、正式報價、客戶個資保護或 2,000 人容量保證。
