import { categories, sellers, products, customers, orders } from './data.js';

const state = {
  view: 'store', role: 'admin', page: 'Visão geral', query: '', category: 'todas', sort: 'relevancia',
  cart: 2, favorites: new Set(['PRA-1176', 'PRA-1152']), toastTimer: null, orderLimit: 15, customerLimit: 24,
  listQuery: '', orderStatus: 'Todos os status', chartDays: 28,
};

const roles = {
  admin: { name: 'Luiza Almeida', title: 'Administradora', initials: 'LA', color: 'forest', nav: ['Visão geral', 'Pedidos', 'Produtos', 'Vendedores', 'Clientes', 'Relatórios', 'Permissões'] },
  manager: { name: 'Marina Costa', title: 'Gestora de operações', initials: 'MC', color: 'violet', nav: ['Visão geral', 'Pedidos', 'Produtos', 'Vendedores', 'Relatórios'] },
  seller: { name: 'Caio Nascimento', title: 'Vendedor · Casa Cedro', initials: 'CN', color: 'orange', nav: ['Visão geral', 'Meus produtos', 'Meus pedidos', 'Meu desempenho', 'Minha loja'] },
  customer: { name: 'Helena Duarte', title: 'Cliente', initials: 'HD', color: 'blue', nav: ['Visão geral', 'Meus pedidos', 'Favoritos', 'Meu perfil'] },
};

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const money = (value) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
const attr = (value) => String(value).replaceAll('&', '&amp;').replaceAll('\"', '&quot;').replaceAll('<', '&lt;');
const sellerById = (id) => sellers.find((seller) => seller.id === id);

function toast(message) {
  const el = $('#toast');
  el.textContent = message;
  el.classList.add('show');
  clearTimeout(state.toastTimer);
  state.toastTimer = setTimeout(() => el.classList.remove('show'), 2800);
}

function productCard(product, index = 0) {
  const seller = sellerById(product.sellerId);
  const favorite = state.favorites.has(product.id);
  return `<article class="product-card" data-product="${product.id}" style="--card-order:${index % 8}">
    <div class="product-media ${product.tone}">
      <img src="${product.image}" alt="${product.name}" loading="lazy" />
      <span class="product-tag">${product.tag}</span>
      <button class="favorite-button ${favorite ? 'is-favorite' : ''}" data-favorite="${product.id}" aria-label="${favorite ? 'Remover dos' : 'Adicionar aos'} favoritos" aria-pressed="${favorite}">${favorite ? '♥' : '♡'}</button>
      <button class="quick-view-button" data-quick-view="${product.id}">Ver detalhes <span>↗</span></button>
    </div>
    <div class="product-copy">
      <div class="product-category">${product.category}</div>
      <h3>${product.name}</h3>
      <div class="product-rating"><span>★</span> ${product.rating.toFixed(1)} <span class="rating-count">(${product.reviews})</span><span class="seller-mini">· ${seller.name}</span></div>
      <div class="product-price-row"><div><strong>${money(product.price)}</strong>${product.oldPrice ? `<del>${money(product.oldPrice)}</del>` : ''}</div><button class="add-button" data-add="${product.id}" aria-label="Adicionar ${product.name} ao carrinho">+</button></div>
    </div>
  </article>`;
}

function filteredProducts() {
  let list = products.filter((item) => {
    const query = state.query.trim().toLocaleLowerCase('pt-BR');
    const haystack = `${item.name} ${item.category} ${sellerById(item.sellerId).name}`.toLocaleLowerCase('pt-BR');
    return (!query || haystack.includes(query)) && (state.category === 'todas' || item.catId === state.category);
  });
  if (state.sort === 'menor') list = [...list].sort((a, b) => a.price - b.price);
  if (state.sort === 'maior') list = [...list].sort((a, b) => b.price - a.price);
  if (state.sort === 'avaliacao') list = [...list].sort((a, b) => b.rating - a.rating);
  return list;
}

function categoryTiles() {
  return categories.map((category, index) => {
    const representative = products.find((product) => product.catId === category.id);
    return `<button class="category-tile" data-category="${category.id}" aria-label="Explorar ${category.name}, ${category.count} itens demonstrativos" style="--card-order:${index};--category-color:${['#dfe9df','#f4e6dc','#e2e8ef','#ede2e8','#ece8db','#dde7e1','#f0e5d7','#e3e3ee'][index]}">
      <img class="category-photo" src="${representative?.image || ''}" alt="" loading="lazy" /><span class="category-shade"></span><span class="category-symbol">${category.icon}</span><span class="category-name">${category.name}</span><span class="category-count">${category.count} itens</span><span class="category-arrow">↗</span>
    </button>`;
  }).join('');
}

function sellerCard(seller) {
  const cover = products.find((product) => product.sellerId === seller.id);
  return `<article class="seller-card seller-card-visual">
    <div class="seller-cover"><img src="${cover?.image || products[0].image}" alt="Seleção de produtos da loja ${seller.name}" loading="lazy" /><span class="seller-cover-kicker">${seller.verified ? 'MARCA VERIFICADA' : 'MARCA EM DESTAQUE'}</span><span class="seller-cover-arrow" aria-hidden="true">↗</span><span class="seller-avatar" style="--avatar-bg:${seller.color}">${seller.initials}</span></div>
    <div class="seller-visual-copy"><div class="seller-title-row"><h3>${seller.name}${seller.verified ? '<span class="verified" title="Vendedor verificado">✓</span>' : ''}</h3><span class="seller-location">${seller.city}</span></div><p>${seller.specialty}</p><div class="seller-card-footer"><div class="seller-meta"><span>★ ${seller.rating.toFixed(1)}</span><span>${seller.sales} vendas</span></div><button class="seller-follow" data-follow="${seller.id}">Conhecer <span>↗</span></button></div></div>
  </article>`;
}

function showProductQuickView(id) {
  const product = products.find((item) => item.id === id);
  if (!product) return;
  const seller = sellerById(product.sellerId);
  const dialog = $('#quick-view-dialog');
  const favorite = state.favorites.has(product.id);
  $('#quick-view-content').innerHTML = `<button class="quick-view-close" data-close-quick-view aria-label="Fechar detalhes">×</button><div class="quick-view-photo"><img src="${product.image}" alt="${product.name}" /><span>${product.tag}</span></div><div class="quick-view-copy"><span class="eyebrow">${product.category} · ${product.id}</span><h2 id="quick-title">${product.name}</h2><div class="quick-view-rating"><span>★ ${product.rating.toFixed(1)}</span> (${product.reviews} avaliações demonstrativas)</div><p class="quick-view-story">Uma escolha de ${seller.name}, feita para levar mais intenção aos pequenos momentos do dia.</p><div class="quick-view-seller"><span class="seller-avatar" style="--avatar-bg:${seller.color}">${seller.initials}</span><span><b>${seller.name}</b><small>${seller.specialty} · ${seller.city}</small></span>${seller.verified ? '<span class="verified" aria-label="Vendedor verificado">✓</span>' : '<small class="seller-unverified">Perfil em análise</small>'}</div><div class="quick-view-price"><strong>${money(product.price)}</strong>${product.oldPrice ? `<del>${money(product.oldPrice)}</del><small>Preço demonstrativo</small>` : ''}</div><div class="quick-view-actions"><button class="primary-button" data-add="${product.id}">Adicionar ao carrinho <span>＋</span></button><button class="quick-favorite ${favorite ? 'is-favorite' : ''}" data-quick-favorite="${product.id}" aria-label="${favorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}" aria-pressed="${favorite}">${favorite ? '♥' : '♡'}</button></div><small class="quick-view-demo">Produto e avaliações fictícios para demonstração da Prateleira.</small></div>`;
  if (!dialog.open) dialog.showModal();
}

function renderStore() {
  const list = filteredProducts();
  $('#store-view').hidden = false;
  $('#dashboard-view').hidden = true;
  $('.store-header').hidden = false;
  $('.store-footer').hidden = false;
  $('#store-link').classList.add('nav-active');
  $('#dashboard-link').classList.remove('nav-active');
  $('#product-grid').innerHTML = list.map((product, index) => productCard(product, index)).join('') || '<div class="empty-state"><span>⌕</span><h3>Nenhum produto encontrado</h3><p>Tente outro termo ou escolha uma categoria diferente.</p><button class="text-button" data-clear-filters>Limpar filtros</button></div>';
  $('#result-count').textContent = `${list.length} ${list.length === 1 ? 'produto encontrado' : 'produtos encontrados'}`;
  $$('.filter-tab').forEach((button) => button.classList.toggle('active', button.dataset.category === state.category));
  $('#category-row').innerHTML = categoryTiles();
  $('#seller-list').innerHTML = sellers.slice(0, 4).map(sellerCard).join('');
  $('#cart-count').textContent = state.cart;
  $('#favorite-count').textContent = state.favorites.size;
}

function roleSelect() {
  return `<label class="role-switcher"><span>Visualizar como</span><select id="role-select" aria-label="Selecionar perfil demonstrativo">
    <option value="admin" ${state.role === 'admin' ? 'selected' : ''}>Administradora</option>
    <option value="manager" ${state.role === 'manager' ? 'selected' : ''}>Gestora</option>
    <option value="seller" ${state.role === 'seller' ? 'selected' : ''}>Vendedor</option>
    <option value="customer" ${state.role === 'customer' ? 'selected' : ''}>Cliente</option>
  </select></label>`;
}

function revenueSeries(days = state.chartDays, sourceOrders = orders) {
  const base = Date.UTC(2026, 10, 26);
  return Array.from({ length: days }, (_, index) => {
    const date = new Date(base - (days - index - 1) * 86400000).toISOString().slice(0, 10);
    return sourceOrders.filter((order) => order.status !== 'Cancelado' && order.createdAt?.slice(0, 10) === date).reduce((sum, order) => sum + order.total, 0);
  });
}

function chartLabels(sourceOrders = orders) {
  const peak = Math.max(...revenueSeries(state.chartDays,sourceOrders), 1);
  return `<div class="chart-labels"><span>${money(peak)}</span><span>${money(peak*.67)}</span><span>${money(peak*.33)}</span><span>R$ 0</span></div>`;
}

function chartSvg(sourceOrders = orders) {
  const width = 650, height = 220, pad = 8;
  const series = revenueSeries(state.chartDays,sourceOrders);
  const max = Math.max(...series, 1);
  const points = series.map((value, i) => `${pad + (i / (series.length - 1)) * (width - pad * 2)},${height - pad - (value / max) * (height - pad * 2)}`).join(' ');
  return `<svg class="revenue-chart" viewBox="0 0 ${width} ${height}" role="img" aria-label="Gráfico de receita fictícia dos últimos ${state.chartDays} dias"><defs><linearGradient id="chart-fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stop-color="#1d6147" stop-opacity=".22"/><stop offset="100%" stop-color="#1d6147" stop-opacity="0"/></linearGradient></defs>
    <path class="chart-area" d="M${points.split(' ').join(' L')} L${width - pad},${height} L${pad},${height} Z"/><polyline points="${points}" fill="none" stroke="#247253" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
    ${series.map((value, i) => i % Math.max(1, Math.floor(series.length / 9)) === 0 || i === series.length - 1 ? `<circle class="chart-dot" cx="${pad + (i / (series.length - 1)) * (width - pad * 2)}" cy="${height - pad - (value / max) * (height - pad * 2)}" r="4"><title>${money(value)}</title></circle>` : '').join('')}
    <line x1="0" y1="55" x2="${width}" y2="55" class="chart-grid"/><line x1="0" y1="110" x2="${width}" y2="110" class="chart-grid"/><line x1="0" y1="165" x2="${width}" y2="165" class="chart-grid"/></svg>`;
}

function revenueInRange(days,sourceOrders=orders) {
  return revenueSeries(days,sourceOrders).reduce((sum,value)=>sum+value,0);
}

function orderPipeline() {
  const stages = [
    ['Pagamento aprovado', 'Pago', '#6693d5'], ['Em separação', 'Separando', '#ca9a42'],
    ['Aguardando envio', 'Pronto para enviar', '#d9794e'], ['Em trânsito', 'Em trânsito', '#7f79c7'],
    ['Entregue', 'Entregue', '#4a9a70'],
  ];
  const total = orders.length;
  return `<section class="pipeline-panel" aria-label="Etapas dos pedidos"><div class="pipeline-heading"><div><span class="eyebrow">FLUXO DA OPERAÇÃO</span><h3>Pedidos em cada etapa</h3><p>Selecione uma etapa para abrir os pedidos correspondentes.</p></div><span class="pipeline-total"><b>${total.toLocaleString('pt-BR')}</b><small>no histórico</small></span></div><div class="pipeline-track">${stages.map(([status,label,color]) => { const count=orderCountByStatus(status); const share=Math.round(count/total*100); return `<button class="pipeline-stage" data-order-stage="${status}" style="--stage-color:${color}" aria-label="Filtrar ${count} pedidos: ${label}"><span class="pipeline-stage-top"><i></i><small>${label}</small></span><strong>${count}</strong><span class="pipeline-meter"><i style="width:${Math.max(4,share)}%"></i></span><span class="pipeline-share">${share}% do total <b>↗</b></span></button>`; }).join('')}</div></section>`;
}

function categoryDonut() {
  const totals = categories.map((category) => {
    const ids = new Set(products.filter((product) => product.catId === category.id).map((product) => product.name));
    const amount = orders.filter((order) => ids.has(order.item) && order.status !== 'Cancelado').reduce((sum, order) => sum + order.total, 0);
    return { ...category, amount };
  }).sort((a,b) => b.amount-a.amount).slice(0,5);
  const sum = totals.reduce((total,category) => total+category.amount,0) || 1;
  const colors = ['#287653','#e9794f','#6e81bb','#c08eae','#d1a344'];
  let offset = 0;
  const gradient = totals.map((category,index) => { const percent=category.amount/sum*100; const segment=`${colors[index]} ${offset}% ${offset+percent}%`; offset+=percent; return segment; }).join(',');
  return `<div class="mix-visual"><div class="mix-donut" style="background:conic-gradient(${gradient})"><div><strong>${money(sum)}</strong><span>por categoria</span></div></div><div class="mix-legend">${totals.map((category,index)=>`<div class="mix-legend-row"><i style="--mix-color:${colors[index]}"></i><span>${category.name}</span><b>${Math.round(category.amount/sum*100)}%</b></div>`).join('')}</div></div>`;
}

function statusPill(status) {
  const key = status.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replaceAll(' ', '-');
  return `<span class="status-pill status-${key}"><i></i>${status}</span>`;
}

function recentOrders(items = orders.slice(0, 5), options = {}) {
  const searchable = [...items].filter((order) => state.orderStatus === 'Todos os status' || order.status === state.orderStatus)
    .filter((order) => !state.listQuery || `${order.id} ${order.customer} ${order.item} ${order.status}`.toLocaleLowerCase('pt-BR').includes(state.listQuery));
  const showMore = options.expandable && items.length > state.orderLimit;
  return `<div class="order-list-region"><div class="order-card-grid">${searchable.slice(0, options.expandable ? state.orderLimit : items.length).map((order) => `<article class="order-visual-card"><div class="order-card-top"><span class="order-id">${order.id}</span>${statusPill(order.status)}</div><div class="order-card-product"><span class="order-product-mark">✦</span><div><b>${order.item}</b><small>${order.customer} · ${sellerById(order.sellerId)?.name || 'Loja independente'}</small></div></div><div class="order-card-bottom"><span>${order.date}</span><strong>${money(order.total)}</strong></div></article>`).join('') || '<div class="empty-copy">Nenhum pedido corresponde a este filtro.</div>'}</div>${showMore ? `<div class="list-more-row"><span>Exibindo ${Math.min(state.orderLimit, searchable.length)} de ${searchable.length} pedidos filtrados</span><button class="secondary-button" data-load-orders>Carregar mais pedidos</button></div>` : ''}</div>`;
}

function sellerTable() {
  const list = sellers.filter((s) => !state.listQuery || `${s.name} ${s.person} ${s.city} ${s.specialty}`.toLocaleLowerCase('pt-BR').includes(state.listQuery));
  return `<div class="seller-list-region"><div class="seller-management-grid">${list.map((s) => `<article class="seller-management-card"><div class="seller-management-head"><span class="seller-avatar" style="--avatar-bg:${s.color}">${s.initials}</span><span class="seller-status ${s.verified ? 'is-verified' : ''}">${s.verified ? 'Verificado' : 'Em análise'}</span></div><h3>${s.name}</h3><p class="seller-owner">${s.person} · ${s.city}</p><p class="seller-specialty">${s.specialty}</p><div class="seller-score-row"><span>★ <b>${s.rating.toFixed(1)}</b> avaliação</span><span>${s.products} produtos</span></div><div class="seller-volume"><div><span>Vendas na plataforma</span><b>${s.sales.toLocaleString('pt-BR')}</b></div><div class="progress-track"><span style="width:${Math.max(20, Math.round(s.sales / Math.max(...sellers.map(x => x.sales)) * 100))}%"></span></div></div><button class="seller-card-action" data-follow="${s.id}">Abrir perfil <span>↗</span></button></article>`).join('') || '<div class="empty-copy">Nenhum vendedor encontrado.</div>'}</div></div>`;
}

function customerTable() {
  const list = customers.filter((c) => !state.listQuery || `${c.name} ${c.email} ${c.city} ${c.status}`.toLocaleLowerCase('pt-BR').includes(state.listQuery));
  const visible = list.slice(0, state.customerLimit);
  return `<div class="customer-list-region"><div class="customer-card-grid">${visible.map((c, i) => `<article class="customer-visual-card"><div class="customer-card-head"><span class="person-avatar">${c.name.split(' ').map(x=>x[0]).slice(0,2).join('')}</span>${statusPill(c.status)}</div><h3>${c.name}</h3><a href="mailto:${c.email}">${c.email}</a><div class="customer-location">⌖ ${c.city}</div><div class="customer-metrics"><div><b>${c.orders}</b><span>pedidos</span></div><div><b>${money(c.total)}</b><span>total comprado</span></div></div><div class="customer-relation"><span>Relacionamento</span><strong>${c.orders >= 5 ? 'Cliente frequente' : c.status === 'Nova' ? 'Recém-chegado' : 'Em crescimento'}</strong></div></article>`).join('') || '<div class="empty-copy">Nenhum cliente encontrado.</div>'}</div>${list.length > visible.length ? `<div class="list-more-row"><span>Exibindo ${visible.length} de ${list.length} clientes</span><button class="secondary-button" data-load-customers>Carregar mais clientes</button></div>` : ''}</div>`;
}

function productTable(items = products.slice(0, 10)) {
  const list = items.filter((p) => !state.listQuery || `${p.name} ${p.category} ${p.id} ${sellerById(p.sellerId)?.name}`.toLocaleLowerCase('pt-BR').includes(state.listQuery));
  return `<div class="product-list-region"><div class="product-admin-grid">${list.map((p) => `<article class="product-admin-card"><div class="product-admin-image"><img src="${p.image}" alt="${p.name}" loading="lazy">${statusPill(p.stock < 7 ? 'Estoque baixo' : 'Ativo')}</div><div class="product-admin-copy"><span class="eyebrow">${p.category}</span><h3>${p.name}</h3><p>${sellerById(p.sellerId).name} · ${p.id}</p><div class="product-admin-data"><strong>${money(p.price)}</strong><span>${p.stock} un. em estoque</span></div><div class="stock-track"><span style="width:${Math.min(100, p.stock * 3)}%;--stock-color:${p.stock < 7 ? '#d66e4c' : '#43866a'}"></span></div></div></article>`).join('') || '<div class="empty-copy">Nenhum produto encontrado.</div>'}</div></div>`;
}

function statCard(label, value, change, note, icon, positive = true) {
  const spark = [9,14,11,19,16,24,21].map((y,index)=>`${index*12},${30-y}`).join(' ');
  return `<article class="stat-card"><div class="stat-top"><span>${label}</span><span class="stat-icon">${icon}</span></div><strong class="stat-value">${value}</strong><div class="stat-bottom"><span class="stat-change ${positive ? 'positive' : 'negative'}">${change}</span><span>${note}</span></div><svg class="stat-spark ${positive?'spark-positive':'spark-negative'}" viewBox="0 0 72 32" aria-hidden="true"><polyline points="${spark}"/></svg></article>`;
}

const grossRevenue = () => orders.filter((order) => order.status !== 'Cancelado').reduce((sum, order) => sum + order.total, 0);
const averageOrder = () => grossRevenue() / Math.max(1, orders.filter((order) => order.status !== 'Cancelado').length);
const activeSellers = () => sellers.filter((seller) => seller.verified).length;
const orderCountByStatus = (status) => orders.filter((order) => order.status === status).length;

function dashboardBody() {
  const role = state.role;
  const page = state.page;
  const revenueGoal = Math.ceil(grossRevenue() * 1.22 / 1000) * 1000;
  const goalProgress = Math.min(100, Math.round(grossRevenue() / Math.max(1,revenueGoal) * 100));
  const periodRevenue = revenueInRange(state.chartDays);
  if (role === 'seller') return sellerDashboard(page);
  if (role === 'customer') return customerDashboard(page);
  if (page === 'Vendedores') return `<div class="page-heading"><div><div class="eyebrow">EQUIPE DO MARKETPLACE</div><h2>Vendedores</h2><p>Uma visão organizada de quem faz a Prateleira acontecer.</p></div><button class="primary-button" data-action="invite-seller">+ Convidar vendedor</button></div><div class="stat-grid compact">${statCard('Vendedores ativos',activeSellers(),'+2','neste mês','♙')}${statCard('Em análise',sellers.length-activeSellers(),'Revisar','perfis demonstrativos','◷',false)}${statCard('Média de avaliação',(sellers.reduce((sum,s)=>sum+s.rating,0)/sellers.length).toFixed(1),'+0,2','avaliação média','★')}${statCard('Vendas acumuladas',sellers.reduce((sum,s)=>sum+s.sales,0).toLocaleString('pt-BR'),'+14,6%','nos perfis demonstrativos','')}</div><section class="panel"><div class="panel-heading"><div><h3>Todos os vendedores</h3><p>${sellers.length} perfis fictícios de diferentes cidades e segmentos</p></div><input class="table-search" placeholder="Buscar loja, pessoa ou cidade" value="${attr(state.listQuery)}" data-table-search="sellers" /></div>${sellerTable()}</section>`;
  if (page === 'Clientes') return `<div class="page-heading"><div><div class="eyebrow">RELACIONAMENTO</div><h2>Clientes</h2><p>Conheça quem compra, volta e indica a Prateleira.</p></div><button class="secondary-button" data-export>Exportar dados</button></div><div class="stat-grid compact">${statCard('Clientes cadastrados',customers.length.toLocaleString('pt-BR'),'+9,3%','na base fictícia','♧')}${statCard('Clientes recorrentes',`${(customers.filter(c=>c.orders>1).length/customers.length*100).toFixed(1).replace('.',',')}%`,'+3,1%','com mais de um pedido','↻')}${statCard('Ticket médio',money(averageOrder()),'+4,8%','por pedido demonstrativo','◉')}${statCard('Cidades representadas',new Set(customers.map(c=>c.city)).size,'Brasil','localidades fictícias','♡')}</div><section class="panel"><div class="panel-heading"><div><h3>Base de clientes</h3><p>${customers.length} perfis fictícios • carregamento progressivo para navegação leve</p></div><input class="table-search" placeholder="Buscar cliente" value="${attr(state.listQuery)}" data-table-search="customers" /></div>${customerTable()}</section>`;
  if (page === 'Produtos') return `<div class="page-heading"><div><div class="eyebrow">CATÁLOGO DO MARKETPLACE</div><h2>Produtos</h2><p>Organize ofertas, estoque e qualidade do catálogo.</p></div><button class="primary-button" data-action="add-product">+ Novo produto</button></div><div class="stat-grid compact">${statCard('Produtos publicados',products.length,'+8','no catálogo de exemplo','▣')}${statCard('Estoque baixo',products.filter(p=>p.stock<7).length,'Ver lista','itens abaixo do mínimo','◷',false)}${statCard('Valor em estoque',money(products.reduce((sum,p)=>sum+p.price*p.stock,0)),'Catálogo','valor bruto aproximado','⌕',false)}${statCard('Categorias ativas',new Set(products.map(p=>p.catId)).size,'Ativas','com fotos distintas','▦')}</div><section class="panel"><div class="panel-heading"><div><h3>Catálogo demonstrativo</h3><p>${products.length} produtos • ${new Set(products.map(p=>p.catId)).size} categorias • imagens individuais</p></div><input class="table-search" placeholder="Buscar produto" value="${attr(state.listQuery)}" data-table-search="products" /></div>${productTable(products)}</section>`;
  if (page === 'Pedidos') return `<div class="page-heading"><div><div class="eyebrow">ACOMPANHAMENTO DE VENDAS</div><h2>Pedidos</h2><p>Acompanhe cada pedido do pagamento à entrega.</p></div><button class="secondary-button" data-export>Exportar pedidos</button></div><div class="stat-grid compact">${statCard('Pedidos no histórico',orders.length.toLocaleString('pt-BR'),'+12,5%','registros demonstrativos','▤')}${statCard('Aguardando envio',orderCountByStatus('Aguardando envio')+orderCountByStatus('Em separação'),'Atenção','preparação ou despacho','◷',false)}${statCard('Em trânsito',orderCountByStatus('Em trânsito'),'Acompanhamento','envios ativos','➤')}${statCard('Concluídos',`${(orderCountByStatus('Entregue')/orders.length*100).toFixed(1).replace('.',',')}%`,'Entregues','do histórico fictício','✓')}</div><section class="panel"><div class="panel-heading"><div><h3>Histórico de pedidos</h3><p>Exibindo registros por página para manter a navegação fluida</p></div><div class="panel-tools"><input class="table-search" placeholder="Buscar pedido, cliente ou produto" value="${attr(state.listQuery)}" data-table-search="orders" /><select class="table-select" aria-label="Filtrar pedidos"><option ${state.orderStatus === 'Todos os status' ? 'selected' : ''}>Todos os status</option>${[...new Set(orders.map(o=>o.status))].map(status=>`<option ${state.orderStatus === status ? 'selected' : ''}>${status}</option>`).join('')}</select></div></div>${recentOrders(orders,{expandable:true})}</section>`;
  if (page === 'Relatórios') return `<div class="page-heading"><div><div class="eyebrow">DESEMPENHO DA OPERAÇÃO</div><h2>Relatórios</h2><p>Explore receita, categorias e produtos com maior saída.</p></div><select class="period-select" data-chart-period aria-label="Período do relatório"><option value="7" ${state.chartDays===7?'selected':''}>Últimos 7 dias</option><option value="28" ${state.chartDays===28?'selected':''}>Últimos 28 dias</option><option value="90" ${state.chartDays===90?'selected':''}>Últimos 90 dias</option></select></div><div class="stat-grid compact">${statCard('Receita no período',money(periodRevenue),'+18,6%','valor dos pedidos aprovados','↗')}${statCard('Pedidos no período',orders.filter(o=>o.createdAt >= new Date(Date.UTC(2026,10,26-state.chartDays+1)).toISOString()).length,'+14,6%','no intervalo selecionado','▤')}${statCard('Vendedores ativos',activeSellers(),'Equipe','perfis verificados','♙')}${statCard('Valor médio',money(averageOrder()),'Por pedido','histórico demonstrativo','R$')}</div><section class="panel chart-panel report-chart-panel"><div class="panel-heading"><div><span class="eyebrow">TENDÊNCIA</span><h3>Receita ao longo do tempo</h3><p>Valores somados por dia • ${state.chartDays} dias</p></div><strong class="chart-total">${money(periodRevenue)}</strong></div>${chartLabels()}${chartSvg()}<div class="chart-dates"><span>Início do período</span><span>Metade do período</span><span>Hoje</span></div></section><div class="dashboard-columns report-columns"><section class="panel report-products-panel"><div class="panel-heading"><div><span class="eyebrow">DESTAQUES</span><h3>Produtos com maior saída</h3><p>Volume de pedidos nos dados fictícios</p></div></div><div class="report-product-list">${[...products].map(product=>({...product,units:orders.filter(order=>order.item===product.name&&order.status!=='Cancelado').length})).sort((a,b)=>b.units-a.units).slice(0,5).map((product,index)=>`<article class="report-product-row"><span class="ranking-number">${String(index+1).padStart(2,'0')}</span><img src="${product.image}" alt="" loading="lazy"><span class="report-product-name"><b>${product.name}</b><small>${sellerById(product.sellerId).name}</small></span><span class="report-product-volume"><b>${product.units}</b><small>pedidos</small></span></article>`).join('')}</div></section><section class="panel mix-panel report-mix-panel"><div class="panel-heading"><div><span class="eyebrow">COMPOSIÇÃO</span><h3>Receita por categoria</h3><p>Percentuais do catálogo vendido</p></div></div>${categoryDonut()}<button class="text-button report-drilldown" data-page="Produtos">Abrir catálogo de produtos <span>↗</span></button></section></div>`;
  if (page === 'Permissões') return `<div class="page-heading"><div><div class="eyebrow">ACESSO E RESPONSABILIDADES</div><h2>Perfis e permissões</h2><p>O que cada papel pode consultar e administrar na plataforma.</p></div><button class="primary-button" data-action="new-role">+ Criar perfil</button></div><div class="permission-banner"><span class="permission-icon">⌑</span><div><b>Modelo de acesso demonstrativo</b><p>Esta tela mostra como os menus e conteúdos mudam por perfil. O controle real de acesso será aplicado no backend da plataforma.</p></div></div><div class="permission-grid">${Object.entries(roles).map(([key, value])=>`<article class="permission-card"><div class="permission-card-top"><span class="role-dot ${value.color}"></span><div><h3>${value.title}</h3><p>${value.name}</p></div><button class="icon-action" aria-label="Mais opções">•••</button></div><div class="permission-count">${value.nav.length} áreas disponíveis</div><div class="permission-tags">${value.nav.map(item=>`<span>${item}</span>`).join('')}</div></article>`).join('')}</div>`;
  return `<div class="page-heading dashboard-page-heading"><div><div class="eyebrow">QUINTA-FEIRA, 26 DE NOVEMBRO</div><h2>Bom dia, ${role === 'admin' ? 'Luiza' : 'Marina'} <span class="wave">✳</span></h2><p>Veja o que está acontecendo na sua Prateleira.</p></div><button class="secondary-button" data-export>Baixar relatório</button></div>
  <div class="demo-notice"><span>i</span> Ambiente de demonstração • Todos os dados e indicadores desta tela são fictícios.</div>
  <section class="dashboard-hero"><div class="dashboard-hero-copy"><span class="hero-live"><i></i> OPERAÇÃO EM MOVIMENTO</span><h2>Seu marketplace está<br/><em>ganhando ritmo.</em></h2><p>Uma leitura visual dos pedidos, da receita e das marcas que fazem a Prateleira acontecer.</p><button class="hero-cta" data-page="Relatórios">Explorar desempenho <span>↗</span></button></div><div class="hero-orbit" aria-hidden="true"><div class="orbit orbit-one"></div><div class="orbit orbit-two"></div><div class="orbit-center"><span>90</span><small>dias de<br/>atividade</small></div><span class="orbit-node node-one">✦</span><span class="orbit-node node-two">↗</span><span class="orbit-node node-three">●</span></div><div class="hero-mini-metrics"><div><span class="mini-metric-icon">▤</span><span><b>${orders.length}</b><small>pedidos no período</small></span></div><div><span class="mini-metric-icon orange">◷</span><span><b>${orderCountByStatus('Aguardando envio')+orderCountByStatus('Em separação')}</b><small>precisam de atenção</small></span></div><div><span class="mini-metric-icon blue">♙</span><span><b>${activeSellers()}</b><small>vendedores ativos</small></span></div></div></section>
  <div class="stat-grid">${statCard('Receita bruta demonstrativa',money(grossRevenue()),'+18,6%','sobre pedidos não cancelados','↗')}${statCard('Pedidos no histórico',orders.length.toLocaleString('pt-BR'),'+14,6%','registros fictícios','▤')}${statCard('Vendedores ativos',activeSellers(),'+2','perfis verificados','♙')}${statCard('Ticket médio',money(averageOrder()),'+4,8%','média dos pedidos válidos','◉')}</div>
  ${orderPipeline()}
  <div class="dashboard-columns overview-columns"><section class="panel chart-panel"><div class="panel-heading"><div><span class="eyebrow">RECEITA</span><h3>Movimento da plataforma</h3><p>Faturamento diário demonstrativo nos últimos ${state.chartDays} dias</p></div><div class="chart-controls"><strong class="chart-total">${money(periodRevenue)}</strong><select class="period-select" data-chart-period aria-label="Período do gráfico"><option value="7" ${state.chartDays===7?'selected':''}>7 dias</option><option value="28" ${state.chartDays===28?'selected':''}>28 dias</option><option value="90" ${state.chartDays===90?'selected':''}>90 dias</option></select></div></div>${chartLabels()}${chartSvg()}<div class="chart-dates"><span>90 dias atrás</span><span>60 dias</span><span>30 dias</span><span>Hoje</span></div></section><aside class="overview-insights"><section class="panel goal-panel"><div class="panel-heading"><div><span class="eyebrow">OBJETIVO DA OPERAÇÃO</span><h3>Meta do período</h3><p>Baseada na receita fictícia registrada</p></div><span class="goal-badge">Em curso</span></div><div class="goal-amount">${money(grossRevenue())}<small>de ${money(revenueGoal)}</small></div><div class="goal-track"><span style="width:${goalProgress}%"></span></div><div class="goal-meta"><span>${goalProgress}% alcançado</span><b>Faltam ${money(Math.max(0,revenueGoal-grossRevenue()))}</b></div><div class="goal-foot"><span class="goal-icon"></span><span><b>Meta de demonstração</b><small>Definida em 122% do faturamento da base</small></span></div></section><section class="panel mix-panel"><div class="panel-heading"><div><span class="eyebrow">ONDE ACONTECE</span><h3>Receita por categoria</h3><p>Distribuição calculada pelos pedidos do catálogo</p></div></div>${categoryDonut()}</section></aside></div>
  <section class="panel orders-panel"><div class="panel-heading"><div><h3>Pedidos recentes</h3><p>Movimentações mais novas da operação demonstrativa</p></div><button class="text-button" data-page="Pedidos">Abrir histórico completo </button></div>${recentOrders(orders.slice(0,8))}</section>
  <section class="panel sellers-panel"><div class="panel-heading"><div><h3>Vendedores em destaque</h3><p>Perfis com maior volume de vendas nos dados de exemplo</p></div><button class="text-button" data-page="Vendedores">Ver vendedores </button></div><div class="seller-strip">${[...sellers].sort((a,b)=>b.sales-a.sales).slice(0,4).map(seller=>`<div class="seller-highlight"><span class="seller-avatar" style="--avatar-bg:${seller.color}">${seller.initials}</span><span><b>${seller.name}</b><small>${seller.sales} vendas · ★ ${seller.rating.toFixed(1)}</small></span><strong>${seller.products} produtos</strong></div>`).join('')}</div></section>`;
}

function sellerDashboard(page) {
  const ownProducts = products.filter(p => p.sellerId === 's01');
  const ownOrders = orders.filter(o => o.sellerId === 's01');
  const ownRevenue = ownOrders.filter(o => o.status !== 'Cancelado').reduce((sum, order) => sum + order.total, 0);
  const ownPending = ownOrders.filter(o => ['Aguardando envio','Em separação','Pagamento aprovado'].includes(o.status)).length;
  const ownDelivered = ownOrders.filter(o => o.status === 'Entregue').length;
  if (page === 'Meus produtos') return `<div class="page-heading"><div><div class="eyebrow">MINHA VITRINE</div><h2>Meus produtos</h2><p>Cuide do catálogo da Casa Cedro.</p></div><button class="primary-button" data-action="add-product">+ Cadastrar produto</button></div><div class="stat-grid compact">${statCard('Produtos no catálogo',ownProducts.length,'Ativos','itens demonstrativos','▣')}${statCard('Estoque baixo',ownProducts.filter(p=>p.stock<7).length,'Repor','itens abaixo do mínimo','◷',false)}${statCard('Visualizações','2.480','+12%','nos últimos 30 dias','◉')}${statCard('Conversão','4,1%','+0,4 pp','na sua vitrine','')}</div><section class="panel"><div class="panel-heading"><div><h3>Produtos da Casa Cedro</h3><p>${ownProducts.length} exemplos neste catálogo demonstrativo</p></div></div>${productTable(ownProducts)}</section>`;
  if (page === 'Meus pedidos') return `<div class="page-heading"><div><div class="eyebrow">MINHAS VENDAS</div><h2>Meus pedidos</h2><p>Acompanhe e prepare os pedidos da sua loja.</p></div><select class="table-select" data-seller-order-filter aria-label="Filtrar pedidos da loja"><option ${state.orderStatus==='Todos os status'?'selected':''}>Todos os status</option>${[...new Set(ownOrders.map(order=>order.status))].map(status=>`<option ${state.orderStatus===status?'selected':''}>${status}</option>`).join('')}</select></div><div class="stat-grid compact">${statCard('Pedidos no período',ownOrders.length,'Histórico','da Casa Cedro','▤')}${statCard('Para enviar',ownPending,'Atenção','preparação ou pagamento','◷',false)}${statCard('Concluídos',ownDelivered,'Entregues','no histórico demonstrativo','✓')}${statCard('Cancelamentos',ownOrders.filter(o=>o.status==='Cancelado').length,'Acompanhar','no histórico','↘')}</div><section class="panel"><div class="panel-heading"><div><span class="eyebrow">FILA DA LOJA</span><h3>Vendas recentes</h3><p>Pedidos, clientes e situação de cada envio</p></div><span class="pipeline-total"><b>${ownPending}</b><small>para preparar</small></span></div>${recentOrders(ownOrders,{expandable:true})}</section>`;
  if (page === 'Meu desempenho') return `<div class="page-heading"><div><div class="eyebrow">DESEMPENHO DA LOJA</div><h2>Meu desempenho</h2><p>Resultados da Casa Cedro no período escolhido.</p></div><select class="period-select" data-chart-period aria-label="Período de desempenho"><option value="7" ${state.chartDays===7?'selected':''}>Últimos 7 dias</option><option value="28" ${state.chartDays===28?'selected':''}>Últimos 28 dias</option><option value="90" ${state.chartDays===90?'selected':''}>Últimos 90 dias</option></select></div><div class="stat-grid compact">${statCard('Vendas no período',money(revenueInRange(state.chartDays,ownOrders)),'Demo','pedidos não cancelados','')}${statCard('Pedidos recebidos',ownOrders.filter(o=>new Date(o.createdAt)>=new Date(Date.UTC(2026,10,26-state.chartDays+1))).length,'No período','na loja','▤')}${statCard('Avaliação','4,9','+0,1','de 5 estrelas','★')}${statCard('Envio pendente',ownPending,'Acompanhar','pedidos em preparação','✓',false)}</div><section class="panel chart-panel"><div class="panel-heading"><div><span class="eyebrow">VENDAS</span><h3>Atividade ao longo do tempo</h3><p>Receita diária demonstrativa da sua loja</p></div><strong class="chart-total">${money(revenueInRange(state.chartDays,ownOrders))}</strong></div>${chartLabels(ownOrders)}${chartSvg(ownOrders)}<div class="chart-dates"><span>Início do período</span><span>Metade do período</span><span>Hoje</span></div></section><div class="seller-quick-actions"><button data-page="Meus pedidos"><span>▤</span><b>Revisar pedidos</b><small>${ownPending} aguardando preparo</small><i>↗</i></button><button data-page="Meus produtos"><span>▣</span><b>Ver estoque</b><small>${ownProducts.filter(p=>p.stock<7).length} produtos com estoque baixo</small><i>↗</i></button></div>`;
  if (page === 'Minha loja') return `<div class="page-heading"><div><div class="eyebrow">PERFIL PÚBLICO</div><h2>Minha loja</h2><p>Como a Casa Cedro aparece para quem visita a Prateleira.</p></div><button class="secondary-button" data-action="edit-store">✎ Editar perfil</button></div><section class="store-profile-card"><div class="store-profile-cover"></div><div class="store-profile-body"><span class="seller-avatar large" style="--avatar-bg:#d9e7df">CC</span><div><h3>Casa Cedro <span class="verified">✓</span></h3><p>Design brasileiro para morar bem. Objetos com materiais honestos e produção cuidadosa.</p><div class="seller-meta"><span>★ 4,9 de avaliação</span><span>428 vendas</span><span>João Pessoa, PB</span></div></div><button class="text-button" data-view-store>Ver vitrine </button></div></section><div class="stat-grid compact">${statCard('Produtos publicados','36','+3','neste mês','▣')}${statCard('Pedidos concluídos','428','+47','nos últimos 30 dias','▤')}${statCard('Tempo médio de resposta','2h 18m','-22 min','vs. mês passado','◷')}</div>`;
  return `<div class="page-heading"><div><div class="eyebrow">PAINEL DO VENDEDOR</div><h2>Olá, Caio <span class="wave">✳</span></h2><p>Um resumo da Casa Cedro nesta semana.</p></div><button class="primary-button" data-action="add-product">+ Novo produto</button></div><div class="demo-notice"><span>i</span> Área do vendedor • Visualização de demonstração da loja Casa Cedro.</div><div class="stat-grid">${statCard('Vendas registradas',money(ownRevenue),'Fictícias','pedidos válidos da loja','')}${statCard('Pedidos recebidos',ownOrders.length,'No histórico','da Casa Cedro','▤')}${statCard('Produtos no catálogo',ownProducts.length,'Ativos','itens demonstrativos','▣')}${statCard('Avaliação da loja','4,9','+0,1','de 5 estrelas','★')}</div><div class="dashboard-columns overview-columns"><section class="panel chart-panel"><div class="panel-heading"><div><h3>Vendas da Casa Cedro</h3><p>${state.chartDays} dias selecionados</p></div><select class="period-select" data-chart-period aria-label="Período das vendas"><option value="7" ${state.chartDays===7?'selected':''}>7 dias</option><option value="28" ${state.chartDays===28?'selected':''}>28 dias</option><option value="90" ${state.chartDays===90?'selected':''}>90 dias</option></select></div>${chartLabels(ownOrders)}${chartSvg(ownOrders)}<div class="chart-dates"><span>Início</span><span>Meio do período</span><span>Hoje</span></div></section><section class="panel seller-tips"><div class="tip-icon">✦</div><div class="eyebrow">DICA DA PRATELEIRA</div><h3>Uma foto melhor pode contar outra história.</h3><p>Produtos com 4 ou mais fotos claras ajudam o cliente a imaginar a peça no dia a dia.</p><button class="text-button" data-page="Meus produtos">Revisar meus produtos </button></section></div><section class="panel"><div class="panel-heading"><div><h3>Meus pedidos recentes</h3><p>Últimas vendas da sua loja</p></div><button class="text-button" data-page="Meus pedidos">Ver pedidos </button></div>${recentOrders(ownOrders)}</section>`;
}

function customerDashboard(page) {
  const favoriteProducts = products.filter(p => state.favorites.has(p.id));
  const account = customers.find(customer => customer.name === 'Helena Duarte');
  const accountOrders = orders.filter(order => order.customer === account.name && order.status !== 'Cancelado');
  const accountTotal = accountOrders.reduce((sum, order) => sum + order.total, 0);
  if (page === 'Favoritos') return `<div class="page-heading"><div><div class="eyebrow">SUA LISTA SALVA</div><h2>Favoritos</h2><p>Ideias que você guardou para voltar depois.</p></div><button class="secondary-button" data-store>Explorar produtos </button></div><div class="product-grid compact-grid">${favoriteProducts.map(productCard).join('') || '<p class="empty-copy">Sua lista está vazia. Toque no coração para salvar um produto.</p>'}</div>`;
  if (page === 'Meu perfil') return `<div class="page-heading"><div><div class="eyebrow">SUA CONTA</div><h2>Meu perfil</h2><p>Informações fictícias para visualizar a experiência de cliente.</p></div><button class="secondary-button" data-action="edit-profile">✎ Editar dados</button></div><section class="panel customer-profile"><span class="person-avatar large-person">HD</span><div><h3>${account.name}</h3><p>${account.email}</p><div class="seller-meta"><span>${account.city}</span><span>Cliente de demonstração</span></div></div></section><div class="stat-grid compact">${statCard('Pedidos realizados',accountOrders.length,'Histórico','compras válidas','▤')}${statCard('Favoritos salvos',String(state.favorites.size),'Atualizado','na sua lista','♡')}${statCard('Total comprado',money(accountTotal),'Demonstrativo','pedidos não cancelados','R$')}</div>`;
  if (page === 'Meus pedidos') return `<div class="page-heading"><div><div class="eyebrow">HISTÓRICO DE COMPRAS</div><h2>Meus pedidos</h2><p>Acompanhe suas compras em lojas independentes.</p></div><button class="secondary-button" data-store>Continuar explorando </button></div><section class="panel"><div class="panel-heading"><div><span class="eyebrow">SUA ATIVIDADE</span><h3>Seus pedidos</h3><p>${accountOrders.length} pedidos válidos no histórico fictício</p></div></div>${recentOrders(accountOrders,{expandable:true})}</section>`;
  return `<div class="page-heading"><div><div class="eyebrow">SUA PRATELEIRA</div><h2>Olá, Helena <span class="wave">✳</span></h2><p>Encontre peças especiais e acompanhe suas compras.</p></div><button class="primary-button" data-store>Explorar novidades </button></div><div class="demo-notice"><span>i</span> Área do cliente • Exemplo de conta e histórico fictícios.</div><div class="stat-grid">${statCard('Pedidos realizados',accountOrders.length,'Histórico','compras válidas','▤')}${statCard('Favoritos',String(state.favorites.size),'Salvos','na sua lista','♡')}${statCard('Avaliação da loja','4,9','Demonstração','das marcas favoritas','★')}${statCard('Total comprado',money(accountTotal),'Demonstrativo','pedidos válidos','R$')}</div><section class="panel"><div class="panel-heading"><div><span class="eyebrow">ACOMPANHAMENTO</span><h3>Pedidos recentes</h3><p>Compras da conta de Helena em diferentes lojas</p></div><button class="text-button" data-page="Meus pedidos">Ver histórico </button></div>${recentOrders(accountOrders.slice(0,3))}</section><section class="panel customer-favorites"><div class="panel-heading"><div><span class="eyebrow">SUA LISTA</span><h3>Guardados com carinho</h3><p>Peças salvas para conferir depois</p></div><button class="text-button" data-page="Favoritos">Ver favoritos </button></div><div class="product-grid">${favoriteProducts.map(productCard).join('')}</div></section>`;
}

function renderDashboard() {
  $('#store-view').hidden = true;
  $('#dashboard-view').hidden = false;
  $('.store-header').hidden = true;
  $('.store-footer').hidden = true;
  $('#store-link').classList.remove('nav-active');
  $('#dashboard-link').classList.add('nav-active');
  const role = roles[state.role];
  $('#dashboard-user-name').textContent = role.name;
  $('#dashboard-user-title').textContent = role.title;
  $('#dashboard-user-initials').textContent = role.initials;
  $('#dashboard-user-initials').className = `user-avatar ${role.color}`;
  $('#dashboard-top-avatar').className = `user-avatar ${role.color}`;
  $('#dashboard-top-avatar').textContent = role.initials;
  $('#dashboard-user-name-top').textContent = role.name;
  $('#store-account-avatar').textContent = role.initials;
  $('#store-account-avatar').className = `account-avatar ${role.color}`;
  $('#role-select-holder').innerHTML = roleSelect();
  $('#dashboard-nav').innerHTML = role.nav.map((item, i) => `<button class="side-link ${state.page === item ? 'side-active' : ''}" data-page="${item}"><span class="side-icon">${['▦','▤','▣','♙','♧','⌁','⌑'][i % 7]}</span><span>${item}</span>${item === 'Pedidos' ? '<span class="side-count">03</span>' : ''}</button>`).join('') + '<div class="sidebar-bottom"><div class="help-card"><span class="help-icon">?</span><b>Precisa de ajuda?</b><small>A equipe Prateleira está aqui para você.</small><button data-help>Falar com suporte </button></div><div class="sidebar-version">PRATELEIRA · DEMO 1.0</div></div>';
  $('#dashboard-content').innerHTML = dashboardBody();
  $('#page-heading-label').textContent = role.title;
}

function openDashboard(role = state.role) {
  state.view = 'dashboard';
  state.role = role;
  state.page = roles[role].nav[0];
  state.listQuery = '';
  state.orderStatus = 'Todos os status';
  state.orderLimit = 15;
  state.customerLimit = 24;
  renderDashboard();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function openStore() {
  state.view = 'store';
  renderStore();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function downloadCsv(filename, rows) {
  const escapeCell = (value) => `"${String(value ?? '').replaceAll('"', '""')}"`;
  const csv = '\ufeff' + rows.map((row) => row.map(escapeCell).join(';')).join('\r\n');
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url; link.download = filename; link.click();
  URL.revokeObjectURL(url);
}

document.addEventListener('click', (event) => {
  const target = event.target.closest('button');
  if (!target) return;
  if (target.matches('#store-link,[data-store]')) { openStore(); $('#dashboard-shell').classList.remove('sidebar-open'); return; }
  if (target.matches('#dashboard-link')) { openDashboard(); return; }
  if (target.dataset.role) { openDashboard(target.dataset.role); return; }
  if (target.hasAttribute('data-scroll-sellers')) { $('#sellers').scrollIntoView({ behavior: 'smooth' }); return; }
  if (target.id === 'dashboard-link-secondary') { openDashboard('seller'); return; }
  if (target.id === 'dashboard-link-top') { state.page = roles[state.role].nav[0]; renderDashboard(); window.scrollTo({ top: 0, behavior: 'smooth' }); return; }
  if (target.dataset.category) {
    state.category = target.dataset.category;
    if (state.view !== 'store') openStore();
    renderStore();
    $('#catalog').scrollIntoView({ behavior: 'smooth' });
    return;
  }
  if (target.dataset.quickView) { showProductQuickView(target.dataset.quickView); return; }
  if (target.hasAttribute('data-close-quick-view')) { $('#quick-view-dialog').close(); return; }
  if (target.dataset.quickFavorite) {
    const id = target.dataset.quickFavorite;
    state.favorites.has(id) ? state.favorites.delete(id) : state.favorites.add(id);
    showProductQuickView(id);
    $('.quick-favorite', $('#quick-view-dialog')).focus();
    $('#favorite-count').textContent = state.favorites.size;
    toast(state.favorites.has(id) ? 'Produto salvo nos favoritos.' : 'Produto removido dos favoritos.');
    return;
  }
  if (target.dataset.favorite) {
    const id = target.dataset.favorite;
    state.favorites.has(id) ? state.favorites.delete(id) : state.favorites.add(id);
    if (state.view === 'store') renderStore(); else renderDashboard();
    toast(state.favorites.has(id) ? 'Produto salvo nos favoritos.' : 'Produto removido dos favoritos.');
    return;
  }
  if (target.dataset.add) {
    state.cart += 1; $('#cart-count').textContent = state.cart;
    const product = products.find(p => p.id === target.dataset.add);
    if ($('#quick-view-dialog').open) $('#quick-view-dialog').close();
    toast(`${product.name} adicionado ao carrinho.`);
    return;
  }
  if (target.dataset.follow) { toast(`Vitrine de ${sellerById(target.dataset.follow).name} adicionada à sua lista.`); return; }
  if (target.hasAttribute('data-order-stage')) { state.page = 'Pedidos'; state.orderStatus = target.dataset.orderStage; state.listQuery = ''; state.orderLimit = 15; renderDashboard(); window.scrollTo({top:0,behavior:'smooth'}); return; }
  if (target.hasAttribute('data-seller-stage')) { state.page = 'Meus pedidos'; state.orderStatus = target.dataset.sellerStage; state.orderLimit = 15; renderDashboard(); window.scrollTo({top:0,behavior:'smooth'}); return; }
  if (target.dataset.page) { state.page = target.dataset.page; state.listQuery = ''; state.orderStatus = 'Todos os status'; state.orderLimit = 15; state.customerLimit = 24; renderDashboard(); window.scrollTo({top:0,behavior:'smooth'}); return; }
  if (target.hasAttribute('data-load-orders')) { state.orderLimit += 15; renderDashboard(); return; }
  if (target.hasAttribute('data-load-customers')) { state.customerLimit += 24; renderDashboard(); return; }
  if (target.dataset.action) {
    const actions = { 'add-product':'O cadastro de produtos estará disponível na próxima etapa.', 'invite-seller':'Convites de vendedores serão ativados após configurar autenticação.', 'new-role':'A gestão real de perfis requer backend e autenticação.', 'edit-store':'Edição da loja disponível na conta real do vendedor.', 'edit-profile':'Edição dos dados será conectada ao perfil autenticado.' };
    toast(actions[target.dataset.action] || 'Ação de demonstração.'); return;
  }
  if (target.hasAttribute('data-export')) {
    if (target.textContent.toLocaleLowerCase('pt-BR').includes('pedido')) {
      downloadCsv('prateleira-pedidos-demonstracao.csv', [['Pedido','Cliente','Produto','Vendedor','Data','Total','Status'], ...orders.map(o => [o.id,o.customer,o.item,sellerById(o.sellerId).name,o.date,money(o.total),o.status])]);
    } else {
      downloadCsv('prateleira-resumo-demonstracao.csv', [['Indicador','Valor'],['Receita bruta',money(grossRevenue())],['Pedidos',orders.length],['Vendas acumuladas dos perfis',sellers.reduce((sum,seller)=>sum+seller.sales,0)],['Vendedores ativos',activeSellers()],['Ticket médio',money(averageOrder())],['Clientes',customers.length],['Produtos no catálogo',products.length],['Período da base','90 dias']]);
    }
    toast('Arquivo CSV de demonstração baixado.'); return;
  }
  if (target.hasAttribute('data-help')) { toast('Canal de suporte demonstrativo.'); return; }
  if (target.hasAttribute('data-view-store')) { openStore(); return; }
  if (target.hasAttribute('data-clear-filters')) { state.category = 'todas'; state.query = ''; $('#hero-query').value = ''; renderStore(); return; }
  if (target.hasAttribute('data-cart')) { toast('Seu carrinho de demonstração contém itens de exemplo.'); return; }
  if (target.hasAttribute('data-menu-toggle')) { $('#dashboard-shell').classList.toggle('sidebar-open'); return; }
});

$('#quick-view-dialog').addEventListener('click', (event) => {
  if (event.target === event.currentTarget) event.currentTarget.close();
});

document.addEventListener('change', (event) => {
  if (event.target.id === 'role-select') { state.listQuery = ''; state.orderStatus = 'Todos os status'; openDashboard(event.target.value); }
  if (event.target.id === 'sort-select') { state.sort = event.target.value; renderStore(); }
  if (event.target.matches('[data-chart-period]')) { state.chartDays = Number(event.target.value); renderDashboard(); }
  if (event.target.matches('.panel .table-select') && state.page === 'Pedidos') { state.orderStatus = event.target.value; state.orderLimit = 15; renderDashboard(); }
  if (event.target.matches('[data-seller-order-filter]')) { state.orderStatus = event.target.value; state.orderLimit = 15; renderDashboard(); }
});

document.addEventListener('input', (event) => {
  if (event.target.matches('[data-table-search]')) {
    state.listQuery = event.target.value.trim().toLocaleLowerCase('pt-BR');
    const inputName = event.target.dataset.tableSearch;
    const focusSelector = `[data-table-search="${inputName}"]`;
    const currentValue = event.target.value;
    const region = inputName === 'customers' ? '.customer-list-region' : inputName === 'sellers' ? '.seller-list-region' : inputName === 'products' ? '.product-list-region' : '.order-list-region';
    const html = inputName === 'customers' ? customerTable() : inputName === 'sellers' ? sellerTable() : inputName === 'products' ? productTable(products) : recentOrders(orders,{expandable:true});
    const fragment = document.createRange().createContextualFragment(html).querySelector(region);
    $(region)?.replaceWith(fragment);
    const search = $(focusSelector); if (search) { search.value = currentValue; search.focus(); search.setSelectionRange(currentValue.length, currentValue.length); }
  }
});

$('#hero-search').addEventListener('submit', (event) => { event.preventDefault(); state.query = $('#hero-query').value; openStore(); $('#catalog').scrollIntoView({ behavior: 'smooth' }); });
$('#newsletter-form').addEventListener('submit', (event) => { event.preventDefault(); const email = $('#newsletter-email').value.trim(); if (email) { toast('Inscrição de demonstração registrada.'); event.target.reset(); } });

renderStore();
