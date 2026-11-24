const router = require('express').Router();
const CarrinhoController = require('../Controller/CarrinhoController.js');

router.post('/create', CarrinhoController.create);
router.get('/getById/:id', CarrinhoController.getById);
router.post('/:id/itens', CarrinhoController.addItem);
router.put('/:id/itens/:produtoId', CarrinhoController.updateItem);
router.delete('/:id/itens/:produtoId', CarrinhoController.removeItem);
router.delete('/delete/:id', CarrinhoController.delete);

module.exports = router;
