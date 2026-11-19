import { getSpecificationFields } from './catalog.js';

export function renderUrlImportPanel(value, result, escape, formatPrice) {
  const preview = result?.status === 'ready' ? renderPreview(result, escape, formatPrice) : '';
  const notice = result ? `<div class="banner ${result.status === 'ready' ? 'ok' : 'warn'}" role="status">${escape(result.message)}</div>` : '';
  return `<div class="panel url-import-panel">
    <div class="row spread url-import-heading"><div><h3>貼上商品網址</h3><p class="small muted">示範「貼網址 → 欄位對照 → 帶入建檔 → 送審」流程。</p></div><span class="tag amber">僅模擬資料</span></div>
    <div class="input-group"><label for="productUrl">商品頁網址</label><input class="field" id="productUrl" type="url" inputmode="url" autocomplete="off" spellcheck="false" placeholder="https://..." value="${escape(value)}"></div>
    <div class="toolbar url-import-actions"><button class="btn line" data-action="pasteProductUrl">從剪貼簿貼上</button><button class="btn alt" data-action="fillDemoProductUrl">填入模擬網址</button><button class="btn" data-action="inspectProductUrl">檢查並預覽</button></div>
    <p class="small muted url-import-note">公開版只讀取內建模擬範例；不會連線品牌網站，也不會將真實網址寫入本機資料。正式網址擷取與資料授權尚未建立。</p>
    ${notice}${preview}
  </div>`;
}

function renderPreview(result, escape, formatPrice) {
  const product = result.candidate;
  const specs = getSpecificationFields(product.category)
    .filter(field => product.specs[field.key] !== undefined)
    .map(field => [field.label, `${product.specs[field.key]}${field.unit || ''}`]);
  const rows = [
    ['品牌', product.brand], ['品名', product.name], ['型號', product.model],
    ['商品類別', product.category], ...specs,
    ['公開市價', formatPrice(product.marketPrice)],
    ['價格類型', '模擬頁面售價'], ['幣別／地區', 'TWD／台灣'], ['商品版本', product.variant],
  ];
  return `<div class="url-import-preview">
    <div class="row spread"><h4>模擬頁面欄位對照</h4><span class="small muted">載入時間：${escape(new Date(result.source.loadedAt).toLocaleString('zh-TW', { hour12: false }))}</span></div>
    <div class="url-import-rows">${rows.map(([label, raw]) => `<div class="url-import-row"><span>${escape(label)}</span><strong>${escape(raw)}</strong><small>模擬值 · 待人工確認</small></div>`).join('')}</div>
    <div class="banner warn">市價會因地區、版本與時間變動。此數字只用於流程展示，不是官網即時價格或公司核准售價。</div>
    <button class="btn" data-action="applyDemoProductUrl">核對後帶入建檔表單</button>
  </div>`;
}
