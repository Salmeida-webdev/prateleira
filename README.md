# Prateleira

Protótipo demonstrativo de marketplace multivendedor, criado do zero. A vitrine inclui catálogo, busca, filtros, ordenação, favoritos e carrinho demonstrativo. Os painéis variam conforme quatro perfis: administração, gestão de operações, vendedor e cliente.

## Rodar localmente

Requer Node.js 20 ou superior. Não há dependências externas de build.

```bash
npm run build
```

Abra `dist/index.html` em um servidor estático local. O diretório `dist/` contém o site pronto para hospedagem estática.

## Conteúdo de demonstração

- 8 categorias e 28 produtos de catálogo, cada um com uma imagem diferente.
- 24 vendedores fictícios, com lojas, responsáveis, especialidades e localidades brasileiras.
- 500 clientes e 800 pedidos determinísticos distribuídos em 90 dias, com totais de clientes agregados do histórico.
- 4 perfis de demonstração com menus e conteúdos diferentes; a área de vendedores inclui produtos, pedidos, desempenho e perfil da loja.
- Exportação CSV demonstrativa nas áreas de relatórios e pedidos.
- Painel com resumo visual da operação, fluxo de pedidos clicável, gráficos vinculados aos pedidos, comparação de 7, 28 e 90 dias, distribuição por categoria e desempenho do vendedor; pesquisa, filtros e carregamento progressivo.
- Vitrine com categorias fotográficas, faixa animada com respeito à preferência por movimento reduzido, entrada progressiva dos produtos e visualização rápida com informações da loja, preço, favoritos e carrinho.

Os dados são exemplos fictícios. As fotografias vêm de URLs do Unsplash e requerem conexão à internet.

## Limite funcional

A troca de perfil serve apenas para apresentar a experiência. Menus e conteúdos são condicionais no navegador; não existe autenticação, banco de dados, checkout, API ou autorização real no servidor. Não use informações pessoais reais neste protótipo. Uma versão operacional precisa de backend, identidade autenticada, regras de acesso por papel e validação de dados no servidor.
