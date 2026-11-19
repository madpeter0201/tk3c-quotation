// All interface icons share one 24px outline grid and inherit the surrounding text colour.
const paths = {
  home: '<path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"/><path d="M9 21v-7h6v7"/>',
  search: '<circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 5 5"/>',
  ai: '<path d="m12 2 1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8z"/><path d="m19 17 .6 1.4L21 19l-1.4.6L19 21l-.6-1.4L17 19l1.4-.6z"/>',
  quote: '<path d="M6 3h9l4 4v14H6a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"/><path d="M15 3v5h4M9 12h6M9 16h6"/>',
  request: '<path d="M3 6h18v13H3zM3 15h5l2 2h4l2-2h5"/><path d="M8 10h8"/>',
  requests: '<path d="M3 6h18v13H3zM3 15h5l2 2h4l2-2h5"/><path d="M8 10h8"/>',
  sku: '<path d="M4 4h10l6 6v10H4z"/><path d="M14 4v6h6M8 14h8M8 17h5"/>',
  catalog: '<ellipse cx="12" cy="5" rx="8" ry="3"/><path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3"/>',
  analytics: '<path d="M4 20h16M6 17v-5h3v5M11 17V7h3v10M16 17V4h3v13"/>',
  phone: '<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M10 5h4M11 19h2"/>',
  laptop: '<rect x="4" y="4" width="16" height="12" rx="1"/><path d="m2 20 2-4h16l2 4zM9 20h6"/>',
  tv: '<rect x="2" y="4" width="20" height="14" rx="2"/><path d="M8 22h8M12 18v4"/>',
  tablet: '<rect x="5" y="2" width="14" height="20" rx="2"/><path d="M11 19h2"/>',
  mouse: '<rect x="7" y="2" width="10" height="20" rx="5"/><path d="M12 2v7"/>',
  bag: '<path d="M4 8h16l1 13H3zM8 8V6a4 4 0 0 1 8 0v2"/>',
};

export function icon(name) {
  return `<svg class="ui-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${paths[name] || paths.catalog}</svg>`;
}

export function productIcon(product) {
  const category = product.category;
  const kind = category === '手機' ? 'phone'
    : category === '筆電' ? 'laptop'
    : category === '電視' ? 'tv'
    : category === '平板' ? 'tablet'
    : /包|袋/.test(product.name) ? 'bag' : 'mouse';
  return icon(kind);
}
