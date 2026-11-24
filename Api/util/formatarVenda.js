module.exports = function formatarVenda(venda) {
    return {
        id: venda.id,
        cliente: venda.cliente,
        formaPagamento: venda.formaPagamento,
        total: Number(venda.total),
        data: venda.data,
        status: venda.status,
        itens: (venda.itens || []).map((item) => ({
            id: item.id,
            produtoId: item.produtoId,
            nomeProduto: item.nomeProduto,
            quantidade: item.quantidade,
            precoUnitario: Number(item.precoUnitario),
            subtotal: Number(item.subtotal)
        }))
    };
};
