const specificationFields = {
  '手機': [
    ['螢幕尺寸', 'screen', '吋'], ['記憶體', 'ram', 'GB'],
    ['儲存容量', 'storage', ''], ['顏色', 'color', ''], ['重量', 'weight', 'kg'],
  ],
  '筆電': [
    ['螢幕尺寸', 'screen', '吋'], ['處理器', 'processor', ''],
    ['記憶體', 'ram', 'GB'], ['儲存容量', 'storage', ''],
    ['顯示晶片', 'graphics', ''], ['重量', 'weight', 'kg'],
  ],
  '電視': [
    ['螢幕尺寸', 'screen', '吋'], ['解析度', 'resolution', ''],
    ['面板類型', 'panel', ''], ['更新率', 'refreshRate', 'Hz'], ['HDR', 'hdr', ''],
  ],
  '平板': [
    ['螢幕尺寸', 'screen', '吋'], ['記憶體', 'ram', 'GB'],
    ['儲存容量', 'storage', ''], ['連線方式', 'connectivity', ''],
    ['顏色', 'color', ''], ['重量', 'weight', 'kg'],
  ],
  '配件': [
    ['配件類型', 'accessoryType', ''], ['連線方式', 'connectivity', ''],
    ['相容裝置', 'compatibility', ''], ['顏色', 'color', ''], ['重量', 'weight', 'kg'],
  ],
};

function normalizeText(value) {
  return String(value ?? '').normalize('NFKC').toLocaleLowerCase('zh-TW').replace(/[\s_-]+/g, '');
}

export function getProductSpecifications(product) {
  const fields = specificationFields[product.category] ?? [];
  return fields.map(([label, key, unit]) => {
    const value = product.specs?.[key] ?? product[key];
    return { label, key, value: value === null || value === undefined || value === '' ? '' : `${value}${unit}` };
  });
}

export function matchesProduct(product, query) {
  const normalizedQuery = normalizeText(query);
  if (!normalizedQuery) return true;
  const specs = getProductSpecifications(product).map(({ value }) => value);
  const searchable = [
    product.brand, product.name, product.model, product.category,
    ...(product.aliases ?? []), ...(product.usage ?? []), ...specs,
    ...Object.values(product.specs ?? {}),
  ].map(normalizeText).join(' ');
  return normalizedQuery.split(/\s+/).every(token => searchable.includes(token));
}

export function searchProducts(products, query = '', { category = '全部', limit = Infinity } = {}) {
  return products
    .filter(product => (category === '全部' || product.category === category) && matchesProduct(product, query))
    .slice(0, limit);
}
