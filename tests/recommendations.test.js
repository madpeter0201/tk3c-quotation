import test from 'node:test';
import assert from 'node:assert/strict';
import { initialProducts } from '../src/data/demo-products.js';
import { parseProductNeed, scoreProduct } from '../src/recommendations.js';

test('自然語句能解析類別、預算、尺寸、記憶體、容量和用途', () => {
  const need = parseProductNeed('找一台14吋、16GB記憶體、512GB以上、適合外出工作，預算3萬元內的筆電');
  assert.equal(need.category, '筆電');
  assert.equal(need.budget, 30000);
  assert.equal(need.screen, 14);
  assert.equal(need.ram, 16);
  assert.equal(need.storage, '512GB');
  assert.deepEqual(need.useCases, ['辦公', '外出']);
});

test('支援帶千分位的預算，不把尺寸或記憶體當成預算', () => {
  const need = parseProductNeed('預算 NT$30,000，14 吋筆電，16GB RAM');
  assert.equal(need.budget, 30000);
  assert.equal(need.screen, 14);
  assert.equal(need.ram, 16);
});

test('未辨識類別時顯示所有類別候選，容量與超預算會進入評分說明', () => {
  const need = parseProductNeed('16GB RAM、1TB 儲存，預算 NT$30,000');
  assert.equal(need.category, '全部');
  const laptop = initialProducts.find(product => product.id === 'p05');
  const result = scoreProduct(laptop, need);
  assert.ok(result.score > 0);
  assert.ok(result.reasons.includes('符合儲存容量需求'));
  assert.ok(result.warnings.some(warning => warning.startsWith('超出預算')));
});
