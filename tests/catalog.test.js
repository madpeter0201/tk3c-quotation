import test from 'node:test';
import assert from 'node:assert/strict';
import { initialProducts } from '../src/data/demo-products.js';
import { getProductSpecifications, matchesProduct, searchProducts } from '../src/catalog.js';

test('型號、別名及動態規格都可搜尋', () => {
  const laptop = initialProducts.find(product => product.id === 'p04');
  assert.equal(matchesProduct(laptop, 'Zenbook 示範款 14'), true);
  assert.equal(matchesProduct(laptop, '華碩'), true);
  assert.equal(matchesProduct(laptop, '16GB'), true);
  assert.equal(matchesProduct(laptop, '輕薄'), true);
});

test('以類別定義規格欄位，沒有資料時保留空值而不虛構', () => {
  const laptop = initialProducts.find(product => product.id === 'p04');
  const phone = initialProducts.find(product => product.id === 'p01');
  assert.deepEqual(getProductSpecifications(laptop).map(({ label }) => label), [
    '螢幕尺寸', '處理器', '記憶體', '儲存容量', '顯示晶片', '重量',
  ]);
  assert.equal(getProductSpecifications(laptop).find(({ key }) => key === 'processor').value, '');
  assert.equal(getProductSpecifications(phone).some(({ label }) => label === '顯示晶片'), false);
});

test('商品查詢可同時套用類別及結果筆數上限', () => {
  const results = searchProducts(initialProducts, '16GB', { category: '筆電', limit: 2 });
  assert.equal(results.length, 2);
  assert.ok(results.every(product => product.category === '筆電'));
});
