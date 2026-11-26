Warning: truncated output (original token count: 10720)
Total output lines: 305

import { categories, sellers, products, customers, orders, weeklyRevenue } from './data.js';

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

function productCard(product) {
  const seller = sellerById(product.sellerId);
  const favorite = state.favorites.has(product.id);
  return `<article class="product-card" data-product="${product.id}">
    <div class="product-media ${product.tone}">
      <img src="${product.image}" alt="${product.name}" loading="lazy" />
      <span class="product-tag">${product.tag}</span>
      <button class="favorite-button ${favorite ? 'is-favorite' : ''}" data-favorite="${product.id}" aria-label="${favorite ? 'Remover dos' : 'Adicionar aos'} favoritos" aria-pressed="${favorite}">${favorite ? '♥' : '♡'}</button>
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
  return categories.map((category, index) => `<button class="category-tile" data-category="${category.id}" style="--category-color:${['#dfe9df','#f4e6dc','#e2e8ef','#ede2e8','#ece8db','#dde7e1','#f0e5d7','#e3e3ee'][index]}">
    <span class="category-symbol">${category.icon}</span><span class="category-name">${category.name}</span><span class="category-count">${category.count} itens</span><span class="category-arrow">+</span>
  </button>`).join('');
}

function sellerCard(seller) {
  return `<article class="seller-card"><div class="seller-avatar" style="--avatar-bg:${seller.color}">${seller.initials}</div><div class="seller-info"><h3>${seller.name}${seller.verified ? '<span class="verified" title="Vendedor verificado">✓</span>' : ''}</h3><p>${seller.specialty}</p><div class="seller-meta"><span>★ ${seller.rating.toFixed(1)}</span><span>${seller.sales} vendas</span><span>${seller.city}</span></div></div><button class="seller-follow" data-follow="${seller.id}">Conhecer</button></article>`;
}

function renderStore() {
  const list = filteredProducts();
  $('#store-view').hidden = false;
  $('#dashboard-view').hidden = true;
  $('.store-header').hidden = false;
  $('.store-footer').hidden = false;
  $('#store-link').classList.add('nav-active');
  $('#dashboard-link').classList.remove('nav-active');
  $('#product-grid').innerHTML = list.map(productCard).join('') || '<div class="empty-state"><span>⌕</span><h3>Nenhum produto encontrado</h3><p>Tente outro termo ou escolha uma categoria diferente.</p><button class="text-button" data-clear-filters>Limpar filtros</button></div>';
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

function chartSvg() {
  const width = 650, height = 220, pad = 8;
  const values = weeklyRevenue.slice(-state.chartDays);
  const max = Math.max(...values);
  const points = values.map((value, i) => `${pad + (i / (values.length - 1)) * (width - pad * 2)},${height - pad - (value / max) * (height - pad * 2)}`).join(' ');
  return `<svg class="revenue-chart" viewBox="0 0 ${width} ${height}" role="img" aria-label="Gráfico de receita fictícia dos últimos ${state.chartDays} dias"><defs><linearGradient id="chart-fill" x1="0" x2="0" y1="0" y2="1"><stop offset="0%" stop-color="#1d6147" stop-opacity=".22"/><stop offset="100%" stop-color="#1d6147" stop-opacity="0"/></linearGradient></defs>
    <path class="chart-area" d="M${points.split(' ').join(' L')} L${width - pad},${height} L${pad},${height} Z"/><polyline points="${points}" fill="none" stroke="#247253" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/>
    <line x1="0" y1="55" x2="${width}" y2="55" class="chart-grid"/><line x1="0" y1="110" x2="${width}" y2="110" class="chart-grid"/><line x1="0" y1="165" x2="${width}" y2="165" class="chart-grid"/></svg>`;
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
  return `<article class="stat-card"><div class="stat-top"><span>${label}</span><span class="stat-icon">${icon}</span></div><strong class="stat-value">${value}</strong><div class="stat-bottom"><span class="stat-change ${positive ? 'positive' : 'negative'}">${change}</span><span>${note}</span></div></article>`;
}

const grossRevenue = () => orders.filter((order) => order.status !== 'Cancelado').reduce((sum, order) => sum + order.total, 0);
const averageOrder = () => grossRevenue() / Math.max(1, orders.filter((order) => order.status !== 'Cancelado').length);
const activeSellers = () => sellers.filter((seller) => seller.verified).length;
const orderCountByStatus = (status) => orders.filter((order) => order.status === status).length;

function dashboardBody() {
  const role = state.role;
  const page = state.page;
  if (role === 'seller') return sellerDashboard(page);
  if (role === 'customer') return customerDashboard(page);
  if (page === 'Vendedores') return `<div class="page-heading"><div><div class="eyebrow">EQUIPE DO MARKETPLACE</div><h2>Vendedores</h2><p>Uma visão organizada de quem faz a Prateleira acontecer.</p></div><button class="primary-button" data-action="invite-seller">+ Convidar vendedor</button></div><div class="stat-grid compact">${statCard('Vendedores ativos',activeSellers(),'+2','neste mês','♙')}${statCard('Em análise',sellers.length-activeSellers(),'Revisar','perfis demonstrativos','◷',false)}${statCard('Média de avaliação',(sellers.reduce((sum,s)=>sum+s.rating,0)/sellers.length).toFixed(1),'+0,2','avaliação média','★')}${statCard('Vendas acumuladas',sellers.reduce((sum,s)=>sum+s.sales,0).toLocaleString('pt-BR'),'+14,6%','nos perfis demonstrativos','')}</div><section class="panel"><div class="panel-heading"><div><h3>Todos os vendedores</h3><p>${sellers.length} perfis fictícios de diferentes cidades e segmentos</p></div><input class="table-search" placeholder="Buscar loja, pessoa ou cidade" value="${attr(state.listQuery)}" data-table-search="sellers" /></div>${sellerTable()}</section>`;
  if (page === 'Clientes') return `<div class="page-heading"><div><div class="eyebrow">RELACIONAMENTO</div><h2>Clientes</h2><p>Conheça quem compra, volta e indica a Prateleira.</p></div><button class="secondary-button" data-export>Exportar dados</button></div><div class="stat-grid compact">${statCard('Clientes cadastrados',customers.length.toLocaleString('pt-BR'),'+9,3%','na base fictícia','♧')}${statCard('Clientes recorrentes',`${(customers.filter(c=>c.orders>1).length/customers.length*100).toFixed(1).replace('.',',')}%`,'+3,1%','com mais de um pedido','↻')}${statCard('Ticket médio',money(averageOrder()),'+4,8%','por pedido demonstrativo','◉')}${statCard('Cidades representadas',new Set(customers.map(c=>c.city)).size,'Brasil','localidades fictícias','♡')}</div><section class="panel"><div class="panel-heading"><div><h3>Base de clientes</h3><p>${customers.length} perfis fictícios • carregamento progressivo para navegação leve</p></div><input class="table-search" placeholder="Buscar cliente" value="${attr(state.listQuery)}" data-table-search="customers" /></div>${customerTable()}</section>`;
  if (page === 'Produtos') return `<div class="page-heading"><div><div class="eyebrow">CATÁLOGO DO MARKETPLACE</div><h2>Produtos</h2><p>Organize ofertas, estoque e qualidade do catálogo.</p></div><button class="primary-button" data-action="add-product">+ Novo produto</button></div><div class="stat-grid compact">${statCard('Produtos publicados',products.length,'+8','no catálogo de exemplo','▣')}${statCard('Estoque baixo',products.filter(p=>p.stock<7).length,'Ver lista','itens abaixo do mínimo','◷',false)}${statCard('Valor em estoque',money(products.reduce((sum,p)=>sum+p.price*p.stock,0)),'Catálogo','valor bruto aproximado','⌕',false)}${statCard('Categorias ativas',new Set(products.map(p=>p.catId)).size,'Ativas','com fotos distintas','▦')}</div><section class="panel"><div class="panel-heading"><div><h3>Catálogo demonstrativo</h3><p>${products.length} produtos • ${new Set(products.map(p=>p.catId)).size} categorias • imagens individuais</p></div><input class="table-search" placeholder="Buscar produto" value="${attr(state.listQuery)}" data-table-search="products" /></div>${productTable(products)}</section>`;
  if (page === 'Pedidos') return `<div class="page-heading"><div><div class="eyebrow">ACOMPANHAMENTO DE VENDAS</div><h2>Pedidos</h2><p>Acompanhe cada pedido do pagamento à entrega.</p></div><button class="secondary-button" data-export>Exportar pedidos</button></div><div class="stat-grid compact">${statCard('Pedidos no histórico',orders.length.toLocaleString('pt-BR'),'+12,5%','registros demonstrativos','▤')}${statCard('Aguardando envio',orderCountByStatus('Aguardando envio')+orderCountByStatus('Em separação'),'Atenção','preparação ou despacho','◷',false)}${statCard('Em trânsito',orderCountByStatus('Em trânsito'),'Acompanhamento','envios ativos','➤')}${statCard('Concluídos',`${(orderCountByStatus('Entregue')/orders.length*100).toFixed(1).replace('.',',')}%`,'Entregues','do histórico fictício','✓')}</div><section class="panel"><div class="panel-heading"><div><h3>Histórico de pedidos</h3><p>Exibindo registros por página para …1720 tokens truncated…ler.products} produtos</strong></div>`).join('')}</div></section>`;
}

function sellerDashboard(page) {
  const ownProducts = products.filter(p => p.sellerId === 's01');
  const ownOrders = orders.filter(o => o.sellerId === 's01');
  const ownRevenue = ownOrders.filter(o => o.status !== 'Cancelado').reduce((sum, order) => sum + order.total, 0);
  const ownPending = ownOrders.filter(o => ['Aguardando envio','Em separação','Pagamento aprovado'].includes(o.status)).length;
  const ownDelivered = ownOrders.filter(o => o.status === 'Entregue').length;
  if (page === 'Meus produtos') return `<div class="page-heading"><div><div class="eyebrow">MINHA VITRINE</div><h2>Meus produtos</h2><p>Cuide do catálogo da Casa Cedro.</p></div><button class="primary-button" data-action="add-product">+ Cadastrar produto</button></div><div class="stat-grid compact">${statCard('Produtos no catálogo',ownProducts.length,'Ativos','itens demonstrativos','▣')}${statCard('Estoque baixo',ownProducts.filter(p=>p.stock<7).length,'Repor','itens abaixo do mínimo','◷',false)}${statCard('Visualizações','2.480','+12%','nos últimos 30 dias','◉')}${statCard('Conversão','4,1%','+0,4 pp','na sua vitrine','')}</div><section class="panel"><div class="panel-heading"><div><h3>Produtos da Casa Cedro</h3><p>${ownProducts.length} exemplos neste catálogo demonstrativo</p></div></div>${productTable(ownProducts)}</section>`;
  if (page === 'Meus pedidos') return `<div class="page-heading"><div><div class="eyebrow">MINHAS VENDAS</div><h2>Meus pedidos</h2><p>Acompanhe e prepare os pedidos da sua loja.</p></div><select class="table-select"><option>Todos os pedidos</option><option>Aguardando envio</option><option>Concluídos</option></select></div><div class="stat-grid compact">${statCard('Pedidos no histórico',ownOrders.length,'Fictícios','da Casa Cedro','▤')}${statCard('Para enviar',ownPending,'Atenção','preparação ou pagamento','◷',false)}${statCard('Concluídos',ownDelivered,'Entregues','no histórico demonstrativo','✓')}${statCard('Cancelamentos',ownOrders.filter(o=>o.status==='Cancelado').length,'Acompanhar','no histórico','↘')}</div><section class="panel"><div class="panel-heading"><div><h3>Vendas recentes</h3><p>Pedido, cliente e situação do envio</p></div></div>${recentOrders(ownOrders)}</section>`;
  if (page === 'Meu desempenho') return `<div class="page-heading"><div><div class="eyebrow">DESEMPENHO DA LOJA</div><h2>Meu desempenho</h2><p>Indicadores da Casa Cedro nos últimos 30 dias.</p></div><select class="table-select"><option>Últimos 30 dias</option><option>Últimos 7 dias</option></select></div><div class="stat-grid compact">${statCard('Vendas brutas',money(12840),'+16,2%','vs. período anterior','')}${statCard('Pedidos','47','+8','vs. período anterior','▤')}${statCard('Avaliação','4,9','+0,1','de 5 estrelas','★')}${statCard('Taxa de envio no prazo','98%','+2%','vs. período anterior','✓')}</div><section class="panel chart-panel"><div class="panel-heading"><div><h3>Vendas ao longo do tempo</h3><p>Atividade demonstrativa da sua loja</p></div><strong class="chart-total">R$ 12,8 mil</strong></div>${chartSvg()}<div class="chart-dates"><span>01 nov</span><span>08 nov</span><span>15 nov</span><span>22 nov</span><span>Hoje</span></div></section>`;
  if (page === 'Minha loja') return `<div class="page-heading"><div><div class="eyebrow">PERFIL PÚBLICO</div><h2>Minha loja</h2><p>Como a Casa Cedro aparece para quem visita a Prateleira.</p></div><button class="secondary-button" data-action="edit-store">✎ Editar perfil</button></div><section class="store-profile-card"><div class="store-profile-cover"></div><div class="store-profile-body"><span class="seller-avatar large" style="--avatar-bg:#d9e7df">CC</span><div><h3>Casa Cedro <span class="verified">✓</span></h3><p>Design brasileiro para morar bem. Objetos com materiais honestos e produção cuidadosa.</p><div class="seller-meta"><span>★ 4,9 de avaliação</span><span>428 vendas</span><span>João Pessoa, PB</span></div></div><button class="text-button" data-view-store>Ver vitrine </button></div></section><div class="stat-grid compact">${statCard('Produtos publicados','36','+3','neste mês','▣')}${statCard('Pedidos concluídos','428','+47','nos últimos 30 dias','▤')}${statCard('Tempo médio de resposta','2h 18m','-22 min','vs. mês passado','◷')}</div>`;
  return `<div class="page-heading"><div><div class="eyebrow">PAINEL DO VENDEDOR</div><h2>Olá, Caio <span class="wave">✳</span></h2><p>Um resumo da Casa Cedro nesta semana.</p></div><button class="primary-button" data-action="add-product">+ Novo produto</button></div><div class="demo-notice"><span>i</span> Área do vendedor • Visualização de demonstração da loja Casa Cedro.</div><div class="stat-grid">${statCard('Vendas registradas',money(ownRevenue),'Fictícias','pedidos válidos da loja','')}${statCard('Pedidos recebidos',ownOrders.length,'No histórico','da Casa Cedro','▤')}${statCard('Produtos no catálogo',ownProducts.length,'Ativos','itens demonstrativos','▣')}${statCard('Avaliação da loja','4,9','+0,1','de 5 estrelas','★')}</div><div class="dashboard-columns overview-columns"><section class="panel chart-panel"><div class="panel-heading"><div><h3>Vendas da Casa Cedro</h3><p>Últimos 28 dias</p></div><select class="period-select" data-chart-period aria-label="Período das vendas"><option value="7" ${state.chartDays===7?'selected':''}>7 dias</option><option value="28" ${state.chartDays===28?'selected':''}>28 dias</option><option value="90" ${state.chartDays===90?'selected':''}>90 dias</option></select></div>${chartSvg()}<div class="chart-dates"><span>01 nov</span><span>08 nov</span><span>15 nov</span><span>22 nov</span><span>Hoje</span></div></section><section class="panel seller-tips"><div class="tip-icon">✦</div><div class="eyebrow">DICA DA PRATELEIRA</div><h3>Uma foto melhor pode contar outra história.</h3><p>Produtos com 4 ou mais fotos claras ajudam o cliente a imaginar a peça no dia a dia.</p><button class="text-button" data-page="Meus produtos">Revisar meus produtos </button></section></div><section class="panel"><div class="panel-heading"><div><h3>Meus pedidos recentes</h3><p>Últimas vendas da sua loja</p></div><button class="text-button" data-page="Meus pedidos">Ver pedidos </button></div>${recentOrders(ownOrders)}</section>`;
}

function customerDashboard(page) {
  const favoriteProducts = products.filter(p => state.favorites.has(p.id));
  if (page === 'Favoritos') return `<div class="page-heading"><div><div class="eyebrow">SUA LISTA SALVA</div><h2>Favoritos</h2><p>Ideias que você guardou para voltar depois.</p></div><button class="secondary-button" data-store>Explorar produtos </button></div><div class="product-grid compact-grid">${favoriteProducts.map(productCard).join('') || '<p class="empty-copy">Sua lista está vazia. Toque no coração para salvar um produto.</p>'}</div>`;
  if (page === 'Meu perfil') return `<div class="page-heading"><div><div class="eyebrow">SUA CONTA</div><h2>Meu perfil</h2><p>Informações fictícias para visualizar a experiência de cliente.</p></div><button class="secondary-button" data-action="edit-profile">✎ Editar dados</button></div><section class="panel customer-profile"><span class="person-avatar large-person">HD</span><div><h3>Helena Duarte</h3><p>helena.duarte@email.test</p><div class="seller-meta"><span>João Pessoa, PB</span><span>Cliente desde março de 2025</span></div></div></section><div class="stat-grid compact">${statCard('Pedidos realizados','08','+2','neste mês','▤')}${statCard('Favoritos salvos',String(state.favorites.size),'Atualizado','na sua lista','♡')}${statCard('Total economizado',money(124),'Em ofertas','compras realizadas','R$')}</div>`;
  if (page === 'Meus pedidos') return `<div class="page-heading"><div><div class="eyebrow">HISTÓRICO DE COMPRAS</div><h2>Meus pedidos</h2><p>Acompanhe suas compras em lojas independentes.</p></div><button class="secondary-button" data-store>Continuar explorando </button></div><section class="panel"><div class="panel-heading"><div><h3>Seus pedidos recentes</h3><p>Dados de exemplo da conta de Helena Duarte</p></div></div>${recentOrders(orders.filter(o => o.customer === 'Helena Duarte' || o.customer === 'Marcelo Fontes').slice(0,4))}</section>`;
  return `<div class="page-heading"><div><div class="eyebrow">SUA PRATELEIRA</div><h2>Olá, Helena <span class="wave">✳</span></h2><p>Encontre peças especiais e acompanhe suas compras.</p></div><button class="primary-button" data-store>Explorar novidades </button></div><div class="demo-notice"><span>i</span> Área do cliente • Exemplo de conta e histórico fictícios.</div><div class="stat-grid">${statCard('Pedidos realizados','08','+2','neste mês','▤')}${statCard('Favoritos',String(state.favorites.size),'Salvos','na sua lista','♡')}${statCard('Avaliações feitas','05','+1','neste mês','★')}${statCard('Economizado',money(124),'Em ofertas','nas suas compras','R$')}</div><section class="panel"><div class="panel-heading"><div><h3>Pedidos recentes</h3><p>Compras em lojas diferentes, reunidas em um só lugar.</p></div><button class="text-button" data-page="Meus pedidos">Ver histórico </button></div>${recentOrders(orders.slice(0,3))}</section><section class="panel customer-favorites"><div class="panel-heading"><div><h3>Guardados com carinho</h3><p>Algumas peças da sua lista de favoritos</p></div><button class="text-button" data-page="Favoritos">Ver favoritos </button></div><div class="product-grid">${favoriteProducts.map(productCard).join('')}</div></section>`;
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
    toast(`${product.name} adicionado ao carrinho.`);
    return;
  }
  if (target.dataset.follow) { toast(`Vitrine de ${sellerById(target.dataset.follow).name} adicionada à sua lista.`); return; }
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
      downloadCsv('prateleira-resumo-demonstracao.csv', [['Indicador','Valor'],['Receita bruta',money(98420)],['Pedidos',458],['Vendas acumuladas da rede',2060],['Vendedores ativos',9],['Ticket médio',money(214.8)],['Conversão','3,82%']]);
    }
    toast('Arquivo CSV de demonstração baixado.'); return;
  }
  if (target.hasAttribute('data-help')) { toast('Canal de suporte demonstrativo.'); return; }
  if (target.hasAttribute('data-view-store')) { openStore(); return; }
  if (target.hasAttribute('data-clear-filters')) { state.category = 'todas'; state.query = ''; $('#hero-query').value = ''; renderStore(); return; }
  if (target.hasAttribute('data-cart')) { toast('Seu carrinho de demonstração contém itens de exemplo.'); return; }
  if (target.hasAttribute('data-menu-toggle')) { $('#dashboard-shell').classList.toggle('sidebar-open'); return; }
});

document.addEventListener('change', (event) => {
  if (event.target.id === 'role-select') { state.listQuery = ''; state.orderStatus = 'Todos os status'; openDashboard(event.target.value); }
  if (event.target.id === 'sort-select') { state.sort = event.target.value; renderStore(); }
  if (event.target.matches('[data-chart-period]')) { state.chartDays = Number(event.target.value); renderDashboard(); }
  if (event.target.matches('.panel .table-select') && state.page === 'Pedidos') { state.orderStatus = event.target.value; state.orderLimit = 15; renderDashboard(); }
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
