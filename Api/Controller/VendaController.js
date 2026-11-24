const db = require('../db/conn.js');
const Carrinho = require('../model/Carrinho.js');
const CarrinhoItem = require('../model/CarrinhoItem.js');
const Venda = require('../model/Venda.js');
const VendaItem = require('../model/VendaItem.js');
const carregarCarrinho = require('../util/carregarCarrinho.js');
const formatarVenda = require('../util/formatarVenda.js');

module.exports = class VendaController {
    static async create(req, res) {
        const { carrinhoId, cliente, formaPagamento } = req.body || {};

        if (!carrinhoId) {
            res.status(422).json({ message: 'O carrinho é obrigatório' });
            return;
        }
        if (!cliente || !String(cliente).trim()) {
            res.status(422).json({ message: 'O nome do cliente é obrigatório' });
            return;
        }
        if (!formaPagamento || !String(formaPagamento).trim()) {
            res.status(422).json({ message: 'A forma de pagamento é obrigatória' });
            return;
        }

        try {
            const carrinho = await carregarCarrinho(carrinhoId);
            if (!carrinho) {
                res.status(404).json({ message: 'Carrinho não encontrado' });
                return;
            }
            if (carrinho.status !== 'aberto') {
                res.status(422).json({ message: 'Este carrinho já foi finalizado' });
                return;
            }
            if (carrinho.itens.length === 0) {
                res.status(422).json({ message: 'Não é possível finalizar um carrinho vazio' });
                return;
            }

            const venda = await db.transaction(async (transaction) => {
                const novaVenda = await Venda.create({
                    cliente: String(cliente).trim(),
                    formaPagamento: String(formaPagamento).trim(),
                    total: carrinho.total,
                    status: 'concluida'
                }, { transaction: transaction });

                for (const item of carrinho.itens) {
                    await VendaItem.create({
                        vendaId: novaVenda.id,
                        produtoId: item.produtoId,
                        nomeProduto: item.nome,
                        quantidade: item.quantidade,
                        precoUnitario: item.precoUnitario,
                        subtotal: item.subtotal
                    }, { transaction: transaction });
                }

                await CarrinhoItem.destroy({ where: { carrinhoId: carrinhoId }, transaction: transaction });
                await Carrinho.update({ status: 'finalizado' }, { where: { id: carrinhoId }, transaction: transaction });

                return novaVenda;
            });

            const itens = await VendaItem.findAll({ where: { vendaId: venda.id } });
            res.status(201).json({
                message: 'Venda finalizada com sucesso!',
                venda: formatarVenda({
                    ...venda.get({ plain: true }),
                    itens: itens.map((item) => item.get({ plain: true }))
                })
            });
        } catch (err) {
            res.status(500).json({ message: 'Erro ao finalizar a venda: ' + err });
        }
    }

    static async getAll(req, res) {
        try {
            const vendas = await Venda.findAll({
                include: [{ model: VendaItem, as: 'itens' }],
                order: [['id', 'DESC']]
            });
            res.status(200).json(vendas.map((venda) => formatarVenda(venda.get({ plain: true }))));
        } catch (err) {
            res.status(500).json({ message: 'Erro ao buscar as vendas: ' + err });
        }
    }

    static async getById(req, res) {
        try {
            const venda = await Venda.findByPk(req.params.id, {
                include: [{ model: VendaItem, as: 'itens' }]
            });
            if (!venda) {
                res.status(404).json({ message: 'Venda não encontrada' });
                return;
            }
            res.status(200).json(formatarVenda(venda.get({ plain: true })));
        } catch (err) {
            res.status(500).json({ message: 'Erro ao buscar a venda: ' + err });
        }
    }
};
