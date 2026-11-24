const Produto = require('../model/Produto.js');
const CarrinhoItem = require('../model/CarrinhoItem.js');
const VendaItem = require('../model/VendaItem.js');
const formatarProduto = require('../util/formatarProduto.js');
const removerArquivo = require('../util/removerArquivo.js');

function validarDados(nome, preco) {
    if (!nome || !String(nome).trim()) {
        return 'O nome é obrigatório';
    }
    if (preco === undefined || preco === null || preco === '') {
        return 'O preço é obrigatório';
    }
    const valor = Number(preco);
    if (!Number.isFinite(valor)) {
        return 'O preço deve ser um número válido';
    }
    if (valor < 0) {
        return 'O preço não pode ser negativo';
    }
    return null;
}

module.exports = class ProdutoController {
    static async create(req, res) {
        const { nome, preco } = req.body || {};
        const erro = validarDados(nome, preco);
        if (erro) {
            res.status(422).json({ message: erro });
            return;
        }

        try {
            const produto = await Produto.create({
                nome: String(nome).trim(),
                preco: Number(preco),
                imagem: req.file ? req.file.filename : null
            });
            res.status(201).json({
                message: 'Produto criado com sucesso!',
                produto: formatarProduto(produto)
            });
        } catch (err) {
            res.status(500).json({ message: 'Erro ao criar o produto:' + err });
        }
    }

    static async getAll(req, res) {
        try {
            const produtos = await Produto.findAll({ order: [['id', 'ASC']] });
            res.status(200).json(produtos.map(formatarProduto));
        } catch (err) {
            res.status(500).json({ message: 'Erro ao buscar os produtos:' + err });
        }
    }

    static async getById(req, res) {
        try {
            const produto = await Produto.findByPk(req.params.id);
            if (!produto) {
                res.status(404).json({ message: 'Produto não encontrado' });
                return;
            }
            res.status(200).json(formatarProduto(produto));
        } catch (err) {
            res.status(500).json({ message: 'Erro ao buscar o produto:' + err });
        }
    }

    static async update(req, res) {
        try {
            const produto = await Produto.findByPk(req.params.id);
            if (!produto) {
                res.status(404).json({ message: 'Produto não encontrado' });
                return;
            }

            const corpo = req.body || {};
            const nome = corpo.nome !== undefined ? corpo.nome : produto.nome;
            const preco = corpo.preco !== undefined ? corpo.preco : produto.preco;
            const erro = validarDados(nome, preco);
            if (erro) {
                res.status(422).json({ message: erro });
                return;
            }

            const imagemAntiga = produto.imagem;
            await produto.update({
                nome: String(nome).trim(),
                preco: Number(preco),
                imagem: req.file ? req.file.filename : produto.imagem
            });
            if (req.file) {
                removerArquivo(imagemAntiga);
            }

            res.status(200).json({
                message: 'Produto atualizado com sucesso',
                produto: formatarProduto(produto)
            });
        } catch (err) {
            res.status(500).json({ message: 'Erro ao atualizar produto:' + err });
        }
    }

    static async delete(req, res) {
        try {
            const produto = await Produto.findByPk(req.params.id);
            if (!produto) {
                res.status(404).json({ message: 'Produto não encontrado' });
                return;
            }

            const imagem = produto.imagem;
            await CarrinhoItem.destroy({ where: { produtoId: produto.id } });
            await VendaItem.update({ produtoId: null }, { where: { produtoId: produto.id } });
            await produto.destroy();
            removerArquivo(imagem);

            res.status(200).json({ message: 'Produto deletado com sucesso' });
        } catch (err) {
            res.status(500).json({ message: 'Erro ao deletar produto:' + err });
        }
    }
};
