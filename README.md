# Prateleira

Protótipo demonstrativo de marketplace multivendedor, criado do zero. A vitrine inclui catálogo, busca, filtros, ordenação, favoritos e carrinho demonstrativo. Os painéis variam conforme quatro perfis: administração, gestão de operações, vendedor e cliente.

## Rodar localmente

Requer Node.js 20 ou superior. Não há dependências externas de build.

```bash
npm run build
```

Abra `dist/index.html` em um servidor estático local. O diretório `dist/` contém o site pronto para hospedagem estática.

## Conteúdo de demonstração

- 8 categorias e 28 produtos de catálogo, com imagens diferentes por produto.
- 10 vendedores fictícios, com nomes, lojas e localidades brasileiras.
- 100 clientes e 162 pedidos determinísticos para preencher as tabelas de gestão.
- 4 perfis de demonstração com menus e conteúdos diferentes; a área de vendedores inclui produtos, pedidos, desempenho e perfil da loja.
- Exportação CSV demonstrativa nas áreas de relatórios e pedidos.

Os dados são exemplos fictícios. As fotografias vêm de URLs do Unsplash e requerem conexão à internet.

## Limite funcional

A troca de perfil serve apenas para apresentar a experiência. Menus e conteúdos são condicionais no navegador; não existe autenticação, banco de dados, checkout, API ou autorização real no servidor. Não use informações pessoais reais neste protótipo. Uma versão operacional precisa de backend, identidade autenticada, regras de acesso por papel e validação de dados no servidor.
