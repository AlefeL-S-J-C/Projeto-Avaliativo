const Carrinho = require('../model/Carrinho.js');
const CarrinhoItem = require('../model/CarrinhoItem.js');
const Produto = require('../model/Produto.js');

module.exports = async function carregarCarrinho(id) {
    const carrinho = await Carrinho.findByPk(id, {
        include: [{
            model: CarrinhoItem,
            as: 'itens',
            include: [{
                model: Produto,
                as: 'produto',
                attributes: ['id', 'nome', 'preco', 'imagem']
            }]
        }]
    });

    if (!carrinho) {
        return null;
    }

    const itens = carrinho.itens.map((item) => {
        const precoUnitario = Number(item.precoUnitario);
        return {
            id: item.id,
            produtoId: item.produtoId,
            nome: item.produto ? item.produto.nome : 'Produto removido',
            imagem: item.produto && item.produto.imagem ? '/uploads/' + item.produto.imagem : null,
            quantidade: item.quantidade,
            precoUnitario: precoUnitario,
            subtotal: Number((precoUnitario * item.quantidade).toFixed(2))
        };
    });

    const total = Number(itens.reduce((soma, item) => soma + item.subtotal, 0).toFixed(2));

    return {
        id: carrinho.id,
        cliente: carrinho.cliente,
        status: carrinho.status,
        itens: itens,
        total: total
    };
};
