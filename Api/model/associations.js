const Produto = require('./Produto.js');
const Carrinho = require('./Carrinho.js');
const CarrinhoItem = require('./CarrinhoItem.js');
const Venda = require('./Venda.js');
const VendaItem = require('./VendaItem.js');

Carrinho.hasMany(CarrinhoItem, { foreignKey: 'carrinhoId', as: 'itens', onDelete: 'CASCADE', hooks: true });
CarrinhoItem.belongsTo(Carrinho, { foreignKey: 'carrinhoId', as: 'carrinho' });

Produto.hasMany(CarrinhoItem, { foreignKey: 'produtoId', as: 'itensCarrinho', onDelete: 'CASCADE', hooks: true });
CarrinhoItem.belongsTo(Produto, { foreignKey: 'produtoId', as: 'produto' });

Venda.hasMany(VendaItem, { foreignKey: 'vendaId', as: 'itens', onDelete: 'CASCADE', hooks: true });
VendaItem.belongsTo(Venda, { foreignKey: 'vendaId', as: 'venda' });

Produto.hasMany(VendaItem, { foreignKey: 'produtoId', as: 'itensVenda', onDelete: 'SET NULL' });
VendaItem.belongsTo(Produto, { foreignKey: 'produtoId', as: 'produto' });

module.exports = { Produto, Carrinho, CarrinhoItem, Venda, VendaItem };
