import test from 'node:test';
import assert from 'node:assert/strict';
import { initialProducts } from '../src/data/demo-products.js';
import { makeCatalogDraft, approveCatalogDraft } from '../src/catalog-admin.js';

test('新商品維持待審核，核准後才可建立可搜尋的商品紀錄', () => {
  const input = { brand: '示範品牌', name: '測試 14 吋筆電', model: 'DEMO-14', category: '筆電', marketPrice: '25900', sourceNote: '虛構測試資料', specs: { screen: '14', ram: '16', storage: '512GB' } };
  const draft = makeCatalogDraft(input, null, [], initialProducts, 'CD-1');
  assert.equal(draft.status, 'pending');
  assert.equal(initialProducts.some(product => product.model === 'DEMO-14'), false);
  const product = approveCatalogDraft(draft, null, 'P-1');
  assert.equal(product.price, 25900);
  assert.equal(product.screen, 14);
  assert.equal(product.source.kind, 'demo_manual');
});

test('相同商品與無效市價不能進入草稿', () => {
  const input = { brand: '示範品牌', name: '測試商品', model: 'DEMO', category: '手機', marketPrice: '0', sourceNote: '示範', specs: {} };
  assert.throws(() => makeCatalogDraft(input, null, [], initialProducts, 'CD-2'), /市價/);
  input.marketPrice = '1000';
  const pending = makeCatalogDraft(input, null, [], initialProducts, 'CD-2');
  assert.throws(() => makeCatalogDraft(input, null, [pending], initialProducts, 'CD-3'), /相同商品/);
});

test('編輯既有商品時，核准前原價格保留；核准後沿用商品 ID', () => {
  const current = initialProducts.find(product => product.id === 'p04');
  const input = { brand: current.brand, name: current.name, model: current.model, category: current.category, marketPrice: '27900', sourceNote: '示範價格調整', specs: { screen: '14', ram: '16', storage: '512GB' } };
  const draft = makeCatalogDraft(input, current, [], initialProducts, 'CD-4');
  assert.equal(current.price, 28900);
  assert.equal(draft.status, 'pending');
  const approved = approveCatalogDraft(draft, current, 'unused');
  assert.equal(approved.id, current.id);
  assert.equal(approved.price, 27900);
  assert.equal(current.price, 28900);
});
