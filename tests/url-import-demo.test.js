import test from 'node:test';
import assert from 'node:assert/strict';
import { DEMO_PRODUCT_URL, inspectDemoProductUrl } from '../src/url-import-demo.js';
import { makeCatalogDraft } from '../src/catalog-admin.js';

test('模擬網址預覽保留版本、市價類型、幣別與來源快照', () => {
  const result = inspectDemoProductUrl(DEMO_PRODUCT_URL, '2026-11-19T00:00:00.000Z');
  assert.equal(result.status, 'ready');
  assert.equal(result.candidate.marketPrice, 19900);
  assert.equal(result.source.priceType, 'page');
  assert.equal(result.source.currency, 'TWD');
  assert.equal(result.source.variant, '256GB／黑色');
  assert.equal(result.source.rawSnapshot.model, 'DEMO-P256');
  assert.equal('inventory' in result.candidate, false);
});

test('真實網址不擷取商品資料；拒絕非 HTTPS 與含帳密網址', () => {
  const unsupported = inspectDemoProductUrl('https://www.example.org/real-product');
  assert.equal(unsupported.status, 'unsupported');
  assert.equal('candidate' in unsupported, false);
  assert.equal('source' in unsupported, false);
  assert.equal(inspectDemoProductUrl('http://demo-brand.example.com/products/phone-256-black').status, 'invalid');
  assert.equal(inspectDemoProductUrl('https://user:password@demo-brand.example.com/products/phone-256-black').status, 'invalid');
});

test('模擬網址帶入的商品仍須建立待審核草稿', () => {
  const result = inspectDemoProductUrl(DEMO_PRODUCT_URL, '2026-11-19T00:00:00.000Z');
  const draft = makeCatalogDraft({
    ...result.candidate,
    sourceNote: '模擬網址欄位核對',
    importSource: result.source,
  }, null, [], [], 'CD-URL-1');
  assert.equal(draft.status, 'pending');
  assert.equal(draft.candidate.source.kind, 'demo_url_fixture');
  assert.equal(draft.candidate.source.url, DEMO_PRODUCT_URL);
  assert.equal(draft.candidate.source.rawSnapshot.marketPrice, 19900);
});
