module.exports = function formatarProduto(produto) {
    const dados = typeof produto.get === 'function' ? produto.get({ plain: true }) : produto;
    return {
        id: dados.id,
        nome: dados.nome,
        preco: Number(dados.preco),
        imagem: dados.imagem ? '/uploads/' + dados.imagem : null,
        createdAt: dados.createdAt,
        updatedAt: dados.updatedAt
    };
};
