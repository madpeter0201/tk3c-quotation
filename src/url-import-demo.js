export const DEMO_PRODUCT_URL = 'https://demo-brand.example.com/products/phone-256-black';

const fixture = Object.freeze({
  brand: '示範品牌',
  name: '模擬星光手機 256GB 黑色',
  model: 'DEMO-P256',
  category: '手機',
  specs: { screen: 6.4, ram: 8, storage: '256GB', color: '黑色', weight: 0.18 },
  marketPrice: 19900,
  priceType: 'page',
  currency: 'TWD',
  region: 'TW',
  variant: '256GB／黑色',
});

export function inspectDemoProductUrl(input, now = new Date().toISOString()) {
  const value = String(input ?? '').trim();
  if (!value) return { status: 'invalid', message: '請先貼上商品頁網址。' };
  if (value.length > 2048) return { status: 'invalid', message: '網址過長，請確認貼上的內容。' };

  let url;
  try { url = new URL(value); } catch { return { status: 'invalid', message: '網址格式不正確。' }; }
  if (url.protocol !== 'https:' || url.username || url.password) {
    return { status: 'invalid', message: '只接受不含帳號密碼的 HTTPS 商品頁網址。' };
  }
  if (url.href !== DEMO_PRODUCT_URL) {
    return {
      status: 'unsupported',
      message: '網址格式可用；公開示範版不會連線、擷取或儲存真實品牌網址。正式匯入需先核准來源與建立後端。',
    };
  }

  const candidate = { ...fixture, specs: { ...fixture.specs } };
  return {
    status: 'ready',
    message: '已載入內建模擬商品資料。請逐欄核對，再帶入建檔表單。',
    candidate,
    source: {
      kind: 'demo_url_fixture',
      url: DEMO_PRODUCT_URL,
      loadedAt: now,
      priceType: fixture.priceType,
      currency: fixture.currency,
      region: fixture.region,
      variant: fixture.variant,
      rawSnapshot: { ...candidate, specs: { ...candidate.specs } },
    },
  };
}
