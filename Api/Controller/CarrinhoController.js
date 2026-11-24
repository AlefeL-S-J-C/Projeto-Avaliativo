const Carrinho = require('../model/Carrinho.js');
const CarrinhoItem = require('../model/CarrinhoItem.js');
const Produto = require('../model/Produto.js');
const carregarCarrinho = require('../util/carregarCarrinho.js');

module.exports = class CarrinhoController {
    static async create(req, res) {
        const corpo = req.body || {};
        try {
            const carrinho = await Carrinho.create({ cliente: corpo.cliente || null });
            res.status(201).json({
                message: 'Carrinho criado com sucesso!',
                carrinho: await carregarCarrinho(carrinho.id)
            });
        } catch (err) {
            res.status(500).json({ message: 'Erro ao criar o carrinho: ' + err });
        }
    }

    static async getById(req, res) {
        try {
            const carrinho = await carregarCarrinho(req.params.id);
            if (!carrinho) {
                res.status(404).json({ message: 'Carrinho não encontrado' });
                return;
            }
            res.status(200).json(carrinho);
        } catch (err) {
            res.status(500).json({ message: 'Erro ao buscar o carrinho: ' + err });
        }
    }

    static async addItem(req, res) {
        const { id } = req.params;
        const corpo = req.body || {};
        const produtoId = Number(corpo.produtoId);
        const quantidade = Number(corpo.quantidade === undefined ? 1 : corpo.quantidade);

        try {
            const carrinho = await Carrinho.findByPk(id);
            if (!carrinho) {
                res.status(404).json({ message: 'Carrinho não encontrado' });
                return;
            }
            if (carrinho.status !== 'aberto') {
                res.status(422).json({ message: 'Não é possível alterar um carrinho finalizado' });
                return;
            }
            if (!Number.isInteger(produtoId) || produtoId <= 0) {
                res.status(422).json({ message: 'Produto inválido' });
                return;
            }
            if (!Number.isInteger(quantidade) || quantidade < 1) {
                res.status(422).json({ message: 'A quantidade deve ser maior que zero' });
                return;
            }

            const produto = await Produto.findByPk(produtoId);
            if (!produto) {
                res.status(404).json({ message: 'Produto não encontrado' });
                return;
            }

            const item = await CarrinhoItem.findOne({ where: { carrinhoId: id, produtoId: produtoId } });
            if (item) {
                item.quantidade += quantidade;
                await item.save();
            } else {
                await CarrinhoItem.create({
                    carrinhoId: id,
                    produtoId: produtoId,
                    quantidade: quantidade,
                    precoUnitario: produto.preco
                });
            }

            res.status(item ? 200 : 201).json({
                message: 'Item adicionado ao carrinho!',
                carrinho: await carregarCarrinho(id)
            });
        } catch (err) {
            res.status(500).json({ message: 'Erro ao adicionar item ao carrinho: ' + err });
        }
    }

    static async updateItem(req, res) {
        const { id, produtoId } = req.params;
        const corpo = req.body || {};
        const quantidade = Number(corpo.quantidade);

        try {
            const carrinho = await Carrinho.findByPk(id);
            if (!carrinho) {
                res.status(404).json({ message: 'Carrinho não encontrado' });
                return;
            }
            if (carrinho.status !== 'aberto') {
                res.status(422).json({ message: 'Não é possível alterar um carrinho finalizado' });
                return;
            }
            if (!Number.isInteger(quantidade) || quantidade < 0) {
                res.status(422).json({ message: 'A quantidade não pode ser negativa' });
                return;
            }

            const item = await CarrinhoItem.findOne({ where: { carrinhoId: id, produtoId: produtoId } });
            if (!item) {
                res.status(404).json({ message: 'Item não encontrado no carrinho' });
                return;
            }

            if (quantidade === 0) {
                await item.destroy();
            } else {
                item.quantidade = quantidade;
                await item.save();
            }

            res.status(200).json({
                message: quantidade === 0 ? 'Item removido do carrinho!' : 'Quantidade atualizada!',
                carrinho: await carregarCarrinho(id)
            });
        } catch (err) {
            res.status(500).json({ message: 'Erro ao atualizar o carrinho: ' + err });
        }
    }

    static async removeItem(req, res) {
        const { id, produtoId } = req.params;

        try {
            const carrinho = await Carrinho.findByPk(id);
            if (!carrinho) {
                res.status(404).json({ message: 'Carrinho não encontrado' });
                return;
            }
            if (carrinho.status !== 'aberto') {
                res.status(422).json({ message: 'Não é possível alterar um carrinho finalizado' });
                return;
            }

            const removidos = await CarrinhoItem.destroy({ where: { carrinhoId: id, produtoId: produtoId } });
            if (removidos === 0) {
                res.status(404).json({ message: 'Item não encontrado no carrinho' });
                return;
            }

            res.status(200).json({
                message: 'Item removido do carrinho!',
                carrinho: await carregarCarrinho(id)
            });
        } catch (err) {
            res.status(500).json({ message: 'Erro ao remover item do carrinho: ' + err });
        }
    }

    static async delete(req, res) {
        try {
            const carrinho = await Carrinho.findByPk(req.params.id);
            if (!carrinho) {
                res.status(404).json({ message: 'Carrinho não encontrado' });
                return;
            }

            await CarrinhoItem.destroy({ where: { carrinhoId: req.params.id } });
            await carrinho.destroy();
            res.status(200).json({ message: 'Carrinho removido com sucesso!' });
        } catch (err) {
            res.status(500).json({ message: 'Erro ao remover o carrinho: ' + err });
        }
    }
};
