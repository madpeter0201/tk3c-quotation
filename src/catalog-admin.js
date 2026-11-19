import { getSpecificationFields } from './catalog.js';
import { DEMO_PRODUCT_URL, inspectDemoProductUrl } from './url-import-demo.js';

export const categories = ['手機', '筆電', '電視', '平板', '配件'];
const numericSpecs = new Set(['screen', 'ram', 'weight', 'refreshRate']);
const symbols = { 手機: '📱', 筆電: '💻', 電視: '📺', 平板: '▣', 配件: '▣' };

export function makeCatalogDraft(input, current, drafts, products, draftId) {
  const brand = String(input.brand ?? '').trim();
  const name = String(input.name ?? '').trim();
  const model = String(input.model ?? '').trim();
  const category = String(input.category ?? '').trim();
  const sourceNote = String(input.sourceNote ?? '').trim();
  const price = Number(input.marketPrice);
  const priceType = String(input.priceType ?? 'demo');
  if (!brand || !name || !model || !categories.includes(category)) throw new Error('請填寫品牌、品名、型號與商品類別');
  if (!Number.isFinite(price) || price <= 0 || !Number.isInteger(price)) throw new Error('請填寫有效的整數市價');
  if (!sourceNote) throw new Error('請填寫示範資料來源註記');
  if (!['demo', 'list', 'page', 'promotion'].includes(priceType)) throw new Error('價格類型無效');
  if (current && drafts.some(d => d.productId === current.id && d.status === 'pending')) throw new Error('此商品已有待審核變更');
  if (!current && (products.some(p => p.brand === brand && p.model === model && p.name === name) || drafts.some(d => d.status === 'pending' && d.candidate.brand === brand && d.candidate.model === model && d.candidate.name === name))) throw new Error('相同商品已存在或等待審核');
  const specs = {};
  for (const field of getSpecificationFields(category)) {
    const raw = String(input.specs?.[field.key] ?? '').trim();
    if (!raw) continue;
    if (numericSpecs.has(field.key)) {
      const value = Number(raw);
      if (!Number.isFinite(value) || value <= 0) throw new Error(`${field.label}必須是正數`);
      specs[field.key] = value;
    } else specs[field.key] = raw;
  }
  const now = new Date().toISOString();
  const demoSource = input.importSource?.kind === 'demo_url_fixture' && input.importSource.url === DEMO_PRODUCT_URL
    ? inspectDemoProductUrl(DEMO_PRODUCT_URL, input.importSource.loadedAt || now).source
    : null;
  return {
    id: draftId,
    productId: current?.id ?? null,
    status: 'pending',
    createdAt: now,
    candidate: { brand, name, model, category, marketPrice: price, specs,
      source: demoSource
        ? { ...demoSource, note: sourceNote, priceType }
        : { kind: 'demo_manual', note: sourceNote, capturedAt: now, priceType } },
  };
}

export function approveCatalogDraft(draft, previous, newId) {
  if (draft.status !== 'pending') throw new Error('僅待審核草稿可核准');
  const candidate = draft.candidate;
  const product = {
    id: previous?.id ?? newId,
    brand: candidate.brand, name: candidate.name, model: candidate.model,
    category: candidate.category, price: candidate.marketPrice,
    marketPrice: candidate.marketPrice, specs: candidate.specs,
    source: candidate.source,
    aliases: previous?.aliases ?? [], usage: previous?.usage ?? [],
    symbol: symbols[candidate.category],
  };
  for (const field of getSpecificationFields(candidate.category)) {
    product[field.key] = candidate.specs[field.key] ?? null;
  }
  return product;
}
