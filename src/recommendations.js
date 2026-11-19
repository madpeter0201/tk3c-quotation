const amountPattern = /(\d+(?:,\d{3})*(?:\.\d+)?)\s*(萬元|萬|千元|千|元|k)?/gi;
const explicitBudgetWords = /預算|大約|約|不到|低於|以內|以下|上下|不超過|nt\$?\s*$/i;
const ramSizes = new Set([4, 6, 8, 12, 16, 24, 32, 48, 64, 96, 128]);

function parseBudget(text) {
  for (const match of text.matchAll(amountPattern)) {
    const amount = Number(match[1].replaceAll(',', ''));
    const unit = (match[2] ?? '').toLowerCase();
    const prefix = text.slice(Math.max(0, match.index - 12), match.index);
    const explicit = Boolean(unit) || explicitBudgetWords.test(prefix);
    if (!explicit) continue;
    const multiplier = unit.startsWith('萬') ? 10000 : unit.startsWith('千') || unit === 'k' ? 1000 : 1;
    const budget = amount * multiplier;
    if (budget >= 1000 && budget <= 1000000) return budget;
  }
  return null;
}

function parseStorage(text) {
  const match = text.match(/\b(1|2)\s*(?:tb|t)\b|\b(128|256|512)\s*(?:gb|g)\b/i);
  if (!match) return null;
  return match[1] ? `${match[1]}TB` : `${match[2]}GB`;
}

function normalizeStorage(value) {
  const normalized = String(value ?? '').replace(/\s+/g, '').toUpperCase();
  const tbMatch = normalized.match(/^(\d+(?:\.\d+)?)T(?:B)?$/);
  if (tbMatch) return Number(tbMatch[1]) * 1024;
  const gbMatch = normalized.match(/^(\d+(?:\.\d+)?)G(?:B)?$/);
  return gbMatch ? Number(gbMatch[1]) : null;
}

export function parseProductNeed(input) {
  const text = String(input ?? '').normalize('NFKC').toLocaleLowerCase('zh-TW');
  const category = /電視|oled|qled|追劇|電影|客廳/.test(text) ? '電視'
    : /手機|iphone|galaxy|拍照/.test(text) ? '手機'
      : /平板|ipad/.test(text) ? '平板'
        : /滑鼠|配件/.test(text) ? '配件'
          : /筆電|筆記型|notebook|laptop|電腦|外出工作/.test(text) ? '筆電' : '全部';
  const screen = text.match(/(\d+(?:\.\d+)?)\s*(?:吋|寸|inch)/i);
  const ram = [...text.matchAll(/\b(\d{1,3})\s*(?:gb|g)\s*(?:記憶體|ram)?/gi)]
    .map(match => Number(match[1])).find(value => ramSizes.has(value)) ?? null;
  const useCases = [
    ['學生', /學生|上課|學校/], ['辦公', /辦公|工作|文書/],
    ['遊戲', /遊戲|電競/], ['設計', /設計|剪輯/], ['攝影', /攝影|拍照/],
    ['電影', /追劇|電影|客廳/], ['外出', /輕|薄|外出|攜帶/],
  ].filter(([, pattern]) => pattern.test(text)).map(([label]) => label);
  return {
    category,
    budget: parseBudget(text),
    screen: screen ? Number(screen[1]) : null,
    ram,
    storage: parseStorage(text),
    light: /輕|薄|外出|攜帶/.test(text),
    useCases,
    raw: String(input ?? ''),
  };
}

function price(value) {
  return `NT$ ${Number(value || 0).toLocaleString('zh-TW')}`;
}

export function scoreProduct(product, need) {
  if (need.category !== '全部' && product.category !== need.category) return null;
  let score = need.category === '全部' ? 18 : 35;
  const reasons = [];
  const warnings = [];
  if (need.ram) {
    if (product.ram == null) warnings.push('記憶體資料不足');
    else if (product.ram >= need.ram) { score += 18; reasons.push('符合記憶體需求'); }
    else { score -= 25; warnings.push('記憶體不足'); }
  }
  if (need.storage) {
    const requested = normalizeStorage(need.storage);
    const available = normalizeStorage(product.storage);
    if (available == null) warnings.push('儲存容量資料不足');
    else if (available >= requested) { score += 16; reasons.push('符合儲存容量需求'); }
    else { score -= 18; warnings.push('儲存容量不足'); }
  }
  if (need.screen) {
    if (product.screen == null) warnings.push('尺寸未確認');
    else if (Math.abs(product.screen - need.screen) <= 0.6) { score += 16; reasons.push('尺寸符合'); }
    else { score -= 10; warnings.push('尺寸與需求不同'); }
  }
  if (need.budget) {
    if (product.price <= need.budget) { score += 14; reasons.push('在預算內'); }
    else { score -= Math.min(16, Math.round((product.price - need.budget) / 1000)); warnings.push(`超出預算 ${price(product.price - need.budget)}`); }
  }
  if (need.light) {
    if (product.weight && product.weight <= 1.4) { score += 10; reasons.push('重量較輕'); }
    else if (product.weight) warnings.push('可能較重');
    else warnings.push('重量資料不足');
  }
  const matchedUse = need.useCases.filter(use => (product.usage ?? []).includes(use));
  if (matchedUse.length) { score += Math.min(10, matchedUse.length * 5); reasons.push(`用途符合：${matchedUse.join('、')}`); }
  else if (need.useCases.length) warnings.push('用途資料不足或未對應');
  return { ...product, score: Math.max(0, Math.min(99, score)), reasons, warnings };
}
