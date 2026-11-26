export const categories = [
  { id: 'casa', name: 'Casa & decoração', icon: '⌂', count: 148 },
  { id: 'moda', name: 'Moda', icon: '✳', count: 236 },
  { id: 'tecnologia', name: 'Tecnologia', icon: '◉', count: 94 },
  { id: 'beleza', name: 'Beleza & cuidado', icon: '✦', count: 122 },
  { id: 'papelaria', name: 'Papelaria', icon: '▤', count: 71 },
  { id: 'esporte', name: 'Esporte & aventura', icon: '⌁', count: 86 },
  { id: 'mesa', name: 'Mesa & cozinha', icon: '◌', count: 109 },
  { id: 'acessorios', name: 'Acessórios', icon: '◇', count: 163 },
];

export const sellers = [
  { id: 's01', name: 'Casa Cedro', person: 'Caio Nascimento', city: 'João Pessoa, PB', rating: 4.9, sales: 428, products: 36, initials: 'CC', color: '#d9e7df', specialty: 'Design brasileiro para morar bem', verified: true },
  { id: 's02', name: 'Ateliê Aurora', person: 'Mirela Costa', city: 'Recife, PE', rating: 4.8, sales: 316, products: 24, initials: 'AA', color: '#f4dfd1', specialty: 'Cerâmica feita à mão', verified: true },
  { id: 's03', name: 'Norte Studio', person: 'Rafaela Lima', city: 'Natal, RN', rating: 4.9, sales: 284, products: 31, initials: 'NS', color: '#e5e2f1', specialty: 'Acessórios contemporâneos', verified: true },
  { id: 's04', name: 'Brisa Natural', person: 'Joana Ribeiro', city: 'Campina Grande, PB', rating: 4.7, sales: 193, products: 19, initials: 'BN', color: '#e4ead6', specialty: 'Autocuidado com ingredientes botânicos', verified: true },
  { id: 's05', name: 'Lume Objetos', person: 'Eduardo Freire', city: 'Olinda, PE', rating: 4.8, sales: 178, products: 17, initials: 'LO', color: '#f0e2c6', specialty: 'Iluminação e pequenos objetos', verified: true },
  { id: 's06', name: 'Linha de Sal', person: 'Camila Dantas', city: 'Cabedelo, PB', rating: 4.9, sales: 159, products: 22, initials: 'LS', color: '#d8e8ec', specialty: 'Moda leve inspirada no litoral', verified: true },
  { id: 's07', name: 'Ponto de Cor', person: 'Luan Barros', city: 'Maceió, AL', rating: 4.6, sales: 143, products: 28, initials: 'PC', color: '#f2ded9', specialty: 'Papelaria e presentes criativos', verified: false },
  { id: 's08', name: 'Ritmo Outdoor', person: 'Pedro Xavier', city: 'João Pessoa, PB', rating: 4.8, sales: 137, products: 21, initials: 'RO', color: '#dce5d6', specialty: 'Equipamentos para explorar', verified: true },
  { id: 's09', name: 'Forma Viva', person: 'Isabela Martins', city: 'Fortaleza, CE', rating: 4.7, sales: 118, products: 16, initials: 'FV', color: '#e7deea', specialty: 'Peças autorais e acessórios', verified: true },
  { id: 's10', name: 'Oficina do Grão', person: 'Bruno Albuquerque', city: 'Areia, PB', rating: 4.9, sales: 104, products: 14, initials: 'OG', color: '#eadcca', specialty: 'Café e utensílios para preparar', verified: true },
];

const extraStores = [
  ['Barro de Lua','Mariana Falcão','João Pessoa, PB','Cerâmica autoral para a casa','#e8d9ce'],
  ['Raiz do Sol','Vinícius Melo','Recife, PE','Moda consciente e tecidos naturais','#e6e4cf'],
  ['Estúdio Mangue','Alice Tavares','Olinda, PE','Objetos com matéria e memória','#d9e5de'],
  ['Vento Norte','Ravi Monteiro','Fortaleza, CE','Acessórios para dias de sol','#e2e3ed'],
  ['Papel de Afeto','Luana Carvalho','Natal, RN','Papelaria feita em pequenos lotes','#f1e1da'],
  ['Casa Jatobá','Bárbara Nunes','Campina Grande, PB','Design funcional de origem local','#e9e1d1'],
  ['Maré Mansa','Davi Araújo','Cabedelo, PB','Peças leves inspiradas pelo litoral','#d8e8e8'],
  ['Flor de Umbu','Rebeca Nóbrega','Areia, PB','Botânicos e cuidado cotidiano','#e4ead7'],
  ['Traço Livre','Samuel Bezerra','Maceió, AL','Ilustração, gravura e presentes','#e9deeb'],
  ['Canto do Barista','Nina Vasconcelos','Caruaru, PE','Café especial e acessórios de preparo','#e8ddcb'],
  ['Pedra Clara','Guilherme Sá','Pipa, RN','Objetos para uma vida ao ar livre','#dce7df'],
  ['Linha Serena','Amanda Paiva','Aracaju, SE','Moda confortável para todos os dias','#f0e2dd'],
  ['Oficina do Mar','Yuri Dantas','João Pessoa, PB','Peças utilitárias feitas à mão','#dce8ed'],
  ['Casa do Ipê','Clara Ramalho','Recife, PE','Detalhes afetivos para presentear','#ece5d2'],
];
const sellerColors = ['#d9e7df','#f4dfd1','#e5e2f1','#e4ead6','#f0e2c6','#d8e8ec','#f2ded9'];
extraStores.forEach(([name, person, city, specialty, color], index) => sellers.push({
  id: `s${String(index + 11).padStart(2,'0')}`, name, person, city, specialty, color,
  initials: name.split(/\s+/).map((part) => part[0]).join('').slice(0,2).toUpperCase(),
  rating: Number((4.5 + ((index * 7) % 5) / 10).toFixed(1)), sales: 62 + ((index * 47) % 290),
  products: 8 + ((index * 5) % 27), verified: index % 5 !== 3,
}));

const photo = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=82`;

export const products = [
  { id: 'PRA-1048', name: 'Luminária Arco em madeira', category: 'Casa & decoração', catId: 'casa', price: 289, oldPrice: 339, sellerId: 's05', rating: 4.9, reviews: 34, stock: 12, image: photo('photo-1507473885765-e6ed057f782c'), tag: 'Feito no Brasil', tone: 'warm' },
  { id: 'PRA-1023', name: 'Tênis urbano Vértice', category: 'Moda', catId: 'moda', price: 239, oldPrice: null, sellerId: 's06', rating: 4.8, reviews: 57, stock: 18, image: photo('photo-1542291026-7eec264c27ff'), tag: 'Mais vendido', tone: 'coral' },
  { id: 'PRA-1191', name: 'Fone Studio sem fio', category: 'Tecnologia', catId: 'tecnologia', price: 319, oldPrice: 389, sellerId: 's03', rating: 4.7, reviews: 42, stock: 9, image: photo('photo-1505740420928-5e560c06d30e'), tag: 'Oferta da semana', tone: 'cool' },
  { id: 'PRA-1072', name: 'Bolsa tiracolo Horizonte', category: 'Acessórios', catId: 'acessorios', price: 198, oldPrice: null, sellerId: 's09', rating: 4.9, reviews: 28, stock: 7, image: photo('photo-1590874103328-eac38a683ce7'), tag: 'Peça autoral', tone: 'soft' },
  { id: 'PRA-1108', name: 'Kit botânico de autocuidado', category: 'Beleza & cuidado', catId: 'beleza', price: 126, oldPrice: 149, sellerId: 's04', rating: 4.8, reviews: 61, stock: 24, image: photo('photo-1608248543803-ba4f8c70ae0b'), tag: 'Ingredientes naturais', tone: 'green' },
  { id: 'PRA-1140', name: 'Caderno A5 capa em tecido', category: 'Papelaria', catId: 'papelaria', price: 64, oldPrice: null, sellerId: 's07', rating: 4.7, reviews: 19, stock: 31, image: photo('photo-1544816155-12df9643f363'), tag: 'Edição limitada', tone: 'soft' },
  { id: 'PRA-1016', name: 'Cadeira de descanso Ninho', category: 'Casa & decoração', catId: 'casa', price: 749, oldPrice: 899, sellerId: 's01', rating: 4.9, reviews: 23, stock: 5, image: photo('photo-1503602642458-232111445657'), tag: 'Design local', tone: 'warm' },
  { id: 'PRA-1262', name: 'Relógio de pulso Meridian', category: 'Acessórios', catId: 'acessorios', price: 279, oldPrice: null, sellerId: 's03', rating: 4.6, reviews: 16, stock: 11, image: photo('photo-1523275335684-37898b6baf30'), tag: 'Clássico', tone: 'cool' },
  { id: 'PRA-1097', name: 'Camisa de linho Maré', category: 'Moda', catId: 'moda', price: 189, oldPrice: 219, sellerId: 's06', rating: 4.8, reviews: 37, stock: 14, image: photo('photo-1598033129183-c4f50c736f10'), tag: 'Algodão e linho', tone: 'soft' },
  { id: 'PRA-1224', name: 'Câmera instantânea Mini', category: 'Tecnologia', catId: 'tecnologia', price: 469, oldPrice: null, sellerId: 's03', rating: 4.8, reviews: 31, stock: 6, image: photo('photo-1516035069371-29a1b244cc32'), tag: 'Presente especial', tone: 'coral' },
  { id: 'PRA-1176', name: 'Vaso cerâmico Bruma', category: 'Casa & decoração', catId: 'casa', price: 119, oldPrice: null, sellerId: 's02', rating: 5.0, reviews: 22, stock: 8, image: photo('photo-1578500494198-246f612d3b3d'), tag: 'Feito à mão', tone: 'warm' },
  { id: 'PRA-1311', name: 'Óculos solar Duna', category: 'Acessórios', catId: 'acessorios', price: 169, oldPrice: 199, sellerId: 's09', rating: 4.7, reviews: 26, stock: 13, image: photo('photo-1511499767150-a48a237f0083'), tag: 'Proteção UV', tone: 'cool' },
  { id: 'PRA-1205', name: 'Garrafa térmica 750 ml', category: 'Esporte & aventura', catId: 'esporte', price: 98, oldPrice: null, sellerId: 's08', rating: 4.8, reviews: 49, stock: 27, image: photo('photo-1602143407151-7111542de6e8'), tag: 'Leve para levar', tone: 'green' },
  { id: 'PRA-1055', name: 'Perfume sólido Flor de Sal', category: 'Beleza & cuidado', catId: 'beleza', price: 79, oldPrice: null, sellerId: 's04', rating: 4.9, reviews: 33, stock: 19, image: photo('photo-1594035910387-fea47794261f'), tag: 'Feito em pequenos lotes', tone: 'soft' },
  { id: 'PRA-1283', name: 'Prato de servir Areia', category: 'Mesa & cozinha', catId: 'mesa', price: 142, oldPrice: null, sellerId: 's02', rating: 4.9, reviews: 17, stock: 10, image: photo('photo-1603199506016-b9a594b593c0'), tag: 'Cerâmica artesanal', tone: 'warm' },
  { id: 'PRA-1129', name: 'Mochila trilha Serra', category: 'Esporte & aventura', catId: 'esporte', price: 349, oldPrice: 399, sellerId: 's08', rating: 4.8, reviews: 39, stock: 4, image: photo('photo-1473448912268-2022ce9509d8'), tag: 'Pronta para a estrada', tone: 'green' },
  { id: 'PRA-1360', name: 'Óleo facial de maracujá', category: 'Beleza & cuidado', catId: 'beleza', price: 92, oldPrice: null, sellerId: 's04', rating: 4.8, reviews: 44, stock: 22, image: photo('photo-1608571423902-eed4a5ad8108'), tag: 'Rotina leve', tone: 'green' },
  { id: 'PRA-1338', name: 'Óculos de leitura Arco', category: 'Acessórios', catId: 'acessorios', price: 145, oldPrice: null, sellerId: 's09', rating: 4.6, reviews: 12, stock: 16, image: photo('photo-1572635196237-14b3f281503f'), tag: 'Acabamento leve', tone: 'cool' },
  { id: 'PRA-1152', name: 'Kit café coado da Serra', category: 'Mesa & cozinha', catId: 'mesa', price: 189, oldPrice: 219, sellerId: 's10', rating: 4.9, reviews: 53, stock: 15, image: photo('photo-1495474472287-4d71bcdd2085'), tag: 'Da Paraíba', tone: 'warm' },
  { id: 'PRA-1247', name: 'Camisa ampla Algodão', category: 'Moda', catId: 'moda', price: 159, oldPrice: null, sellerId: 's06', rating: 4.7, reviews: 21, stock: 17, image: photo('photo-1523381210434-271e8be1f52b'), tag: 'Caimento confortável', tone: 'soft' },
  { id: 'PRA-1303', name: 'Bolsa de lona Caminho', category: 'Acessórios', catId: 'acessorios', price: 138, oldPrice: null, sellerId: 's07', rating: 4.8, reviews: 18, stock: 23, image: photo('photo-1548036328-c9fa89d128fa'), tag: 'Uso diário', tone: 'coral' },
  { id: 'PRA-1182', name: 'Vela aromática Entardecer', category: 'Casa & decoração', catId: 'casa', price: 72, oldPrice: 85, sellerId: 's05', rating: 4.9, reviews: 46, stock: 20, image: photo('photo-1603006905003-be475563bc59'), tag: 'Cera vegetal', tone: 'warm' },
  { id: 'PRA-1210', name: 'Tapete de yoga Raiz', category: 'Esporte & aventura', catId: 'esporte', price: 179, oldPrice: null, sellerId: 's08', rating: 4.7, reviews: 24, stock: 8, image: photo('photo-1592432678016-e910b452f9a2'), tag: 'Superfície aderente', tone: 'green' },
  { id: 'PRA-1355', name: 'Necessaire Horizonte', category: 'Acessórios', catId: 'acessorios', price: 88, oldPrice: null, sellerId: 's09', rating: 4.8, reviews: 15, stock: 12, image: photo('photo-1556228720-195a672e8a03'), tag: 'Feita em Recife', tone: 'soft' },
  { id: 'PRA-1168', name: 'Bule de cerâmica Nuvem', category: 'Mesa & cozinha', catId: 'mesa', price: 154, oldPrice: null, sellerId: 's02', rating: 4.9, reviews: 27, stock: 6, image: photo('photo-1493857671505-72967e2e2760'), tag: 'Série artesanal', tone: 'cool' },
  { id: 'PRA-1421', name: 'Fone esportivo Pulse', category: 'Tecnologia', catId: 'tecnologia', price: 229, oldPrice: 269, sellerId: 's03', rating: 4.5, reviews: 18, stock: 10, image: photo('photo-1583394838336-acd977736f90'), tag: 'Resistente ao suor', tone: 'coral' },
  { id: 'PRA-1412', name: 'Porta-retrato Moldura Viva', category: 'Casa & decoração', catId: 'casa', price: 96, oldPrice: null, sellerId: 's01', rating: 4.8, reviews: 20, stock: 14, image: photo('photo-1513519245088-0e12902e5a38'), tag: 'Madeira certificada', tone: 'warm' },
  { id: 'PRA-1389', name: 'Kit aquarela de bolso', category: 'Papelaria', catId: 'papelaria', price: 112, oldPrice: null, sellerId: 's07', rating: 4.7, reviews: 29, stock: 25, image: photo('photo-1513364776144-60967b0f800f'), tag: 'Para criar em qualquer lugar', tone: 'coral' },
];

export const customers = [
  { name: 'Helena Duarte', email: 'helena.duarte@email.test', city: 'João Pessoa, PB', orders: 8, total: 1268, status: 'Ativa' },
  { name: 'Marcelo Fontes', email: 'marcelo.fontes@email.test', city: 'Recife, PE', orders: 6, total: 944, status: 'Ativa' },
  { name: 'Ana Luiza Campos', email: 'ana.campos@email.test', city: 'Natal, RN', orders: 5, total: 721, status: 'Ativa' },
  { name: 'Breno Oliveira', email: 'breno.oliveira@email.test', city: 'Campina Grande, PB', orders: 4, total: 608, status: 'Ativa' },
  { name: 'Lívia Mendonça', email: 'livia.mendonca@email.test', city: 'Maceió, AL', orders: 4, total: 539, status: 'Ativa' },
  { name: 'Daniela Paes', email: 'daniela.paes@email.test', city: 'Fortaleza, CE', orders: 3, total: 482, status: 'Ativa' },
  { name: 'Rogério Alves', email: 'rogerio.alves@email.test', city: 'João Pessoa, PB', orders: 3, total: 397, status: 'Ativa' },
  { name: 'Sofia Lins', email: 'sofia.lins@email.test', city: 'Olinda, PE', orders: 2, total: 316, status: 'Ativa' },
  { name: 'Marina Paiva', email: 'marina.paiva@email.test', city: 'Cabedelo, PB', orders: 2, total: 277, status: 'Nova' },
  { name: 'Caetano Farias', email: 'caetano.farias@email.test', city: 'Aracaju, SE', orders: 1, total: 189, status: 'Nova' },
  { name: 'Tereza Nóbrega', email: 'tereza.nobrega@email.test', city: 'João Pessoa, PB', orders: 1, total: 154, status: 'Nova' },
  { name: 'Ícaro Vasconcelos', email: 'icaro.vasconcelos@email.test', city: 'Recife, PE', orders: 1, total: 98, status: 'Nova' },
];

// Registros determinísticos para deixar as tabelas de gestão preenchidas sem
// depender de API ou de dados pessoais reais.
const extraFirstNames = ['Aline', 'André', 'Bianca', 'Cecília', 'Davi', 'Elisa', 'Felipe', 'Gabriela', 'Heitor', 'Isadora', 'Júlia', 'Kaique', 'Laís', 'Miguel', 'Natália', 'Otávio', 'Paula', 'Rafael', 'Sabrina', 'Tiago', 'Valentina', 'Wesley', 'Yasmin', 'Zeca'];
const extraLastNames = ['Azevedo', 'Barbosa', 'Cavalcanti', 'Dantas', 'Esteves', 'Farias', 'Gomes', 'Holanda', 'Ibiapina', 'Junqueira', 'Lacerda', 'Medeiros', 'Nóbrega', 'Queiroz', 'Ramalho', 'Siqueira', 'Tavares', 'Vasconcelos'];
const demoCities = ['João Pessoa, PB', 'Recife, PE', 'Natal, RN', 'Campina Grande, PB', 'Maceió, AL', 'Fortaleza, CE', 'Olinda, PE', 'Cabedelo, PB', 'Aracaju, SE', 'Areia, PB', 'Caruaru, PE', 'Pipa, RN'];

for (let i = 0; i < 488; i += 1) {
  const first = extraFirstNames[i % extraFirstNames.length];
  const last = extraLastNames[Math.floor(i / extraFirstNames.length) % extraLastNames.length];
  const suffix = Math.floor(i / (extraFirstNames.length * extraLastNames.length)) + 1;
  const name = `${first} ${last}${suffix > 1 ? ` ${suffix}` : ''}`;
  customers.push({
    name,
    email: `${first}.${last}${suffix > 1 ? suffix : ''}`.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('pt-BR') + '@email.test',
    city: demoCities[i % demoCities.length],
    orders: 1 + ((i * 7) % 12),
    total: 89 + ((i * 173) % 2410),
    status: i % 5 === 0 ? 'Nova' : 'Ativa',
  });
}

export const orders = [
  { id: '#PR-8426', customer: 'Helena Duarte', item: 'Luminária Arco em madeira', sellerId: 's05', date: 'Hoje, 09:42', total: 289, status: 'Em separação' },
  { id: '#PR-8425', customer: 'Marcelo Fontes', item: 'Tênis urbano Vértice', sellerId: 's06', date: 'Hoje, 09:10', total: 239, status: 'Aguardando envio' },
  { id: '#PR-8424', customer: 'Ana Luiza Campos', item: 'Kit botânico de autocuidado', sellerId: 's04', date: 'Hoje, 08:36', total: 126, status: 'Pagamento aprovado' },
  { id: '#PR-8423', customer: 'Breno Oliveira', item: 'Caderno A5 capa em tecido', sellerId: 's07', date: 'Ontem, 18:54', total: 64, status: 'Em trânsito' },
  { id: '#PR-8422', customer: 'Lívia Mendonça', item: 'Cadeira de descanso Ninho', sellerId: 's01', date: 'Ontem, 17:22', total: 749, status: 'Pagamento aprovado' },
  { id: '#PR-8421', customer: 'Daniela Paes', item: 'Bolsa tiracolo Horizonte', sellerId: 's09', date: 'Ontem, 16:48', total: 198, status: 'Entregue' },
  { id: '#PR-8420', customer: 'Rogério Alves', item: 'Garrafa térmica 750 ml', sellerId: 's08', date: 'Ontem, 15:31', total: 98, status: 'Em trânsito' },
  { id: '#PR-8419', customer: 'Sofia Lins', item: 'Kit café coado da Serra', sellerId: 's10', date: '26 nov, 13:05', total: 189, status: 'Entregue' },
  { id: '#PR-8418', customer: 'Marina Paiva', item: 'Vaso cerâmico Bruma', sellerId: 's02', date: '26 nov, 11:47', total: 119, status: 'Entregue' },
  { id: '#PR-8417', customer: 'Caetano Farias', item: 'Relógio de pulso Meridian', sellerId: 's03', date: '26 nov, 10:29', total: 279, status: 'Cancelado' },
  { id: '#PR-8416', customer: 'Tereza Nóbrega', item: 'Camisa de linho Maré', sellerId: 's06', date: '25 nov, 16:12', total: 189, status: 'Entregue' },
  { id: '#PR-8415', customer: 'Ícaro Vasconcelos', item: 'Vela aromática Entardecer', sellerId: 's05', date: '25 nov, 15:18', total: 72, status: 'Entregue' },
];

const orderStatuses = ['Entregue', 'Entregue', 'Em trânsito', 'Aguardando envio', 'Pagamento aprovado', 'Em separação', 'Cancelado'];
for (let i = 0; i < 788; i += 1) {
  const product = products[(i * 11 + 3) % products.length];
  const customer = customers[(i * 13 + 5) % customers.length];
  const day = 1 + (i % 26);
  const hour = 8 + ((i * 5) % 12);
  const minute = (i * 17) % 60;
  orders.push({
    id: `#PR-${8600 + i}`,
    customer: customer.name,
    item: product.name,
    sellerId: product.sellerId,
    date: `${String(day).padStart(2, '0')} nov, ${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`,
    total: product.price,
    status: orderStatuses[(i * 3) % orderStatuses.length],
  });
}

for (const customer of customers) {
  const customerOrders = orders.filter((order) => order.customer === customer.name && order.status !== 'Cancelado');
  customer.orders = customerOrders.length;
  customer.total = customerOrders.reduce((sum, order) => sum + order.total, 0);
  customer.status = customer.orders > 0 ? 'Ativa' : 'Nova';
}

export const weeklyRevenue = Array.from({ length: 90 }, (_, index) => Math.round(38 + index * 1.12 + ((index * 17) % 29) + 8 * Math.sin(index / 3)));

