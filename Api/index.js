const express = require('express');
const app = express();
const port = 5000;
const conn = require('./db/conn.js');
require('./model/associations.js');
const cors = require('cors');
const path = require('path');
const migrar = require('./db/migrar.js');

app.use(express.json());
app.use((req, res, next) => {
    if (!req.body) {
        req.body = {};
    }
    next();
});
app.use(cors({ credentials: true, origin: '*' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const produtoRoutes = require('./router/ProdutoRoutes.js');
const carrinhoRoutes = require('./router/CarrinhoRoutes.js');
const vendaRoutes = require('./router/VendaRoutes.js');
app.use('/produto', produtoRoutes);
app.use('/carrinho', carrinhoRoutes);
app.use('/venda', vendaRoutes);

migrar()
    .then(() => conn.sync({ alter: true }))
    .then(() => { app.listen(port, () => console.log('API rodando na porta ' + port)) })
    .catch((err) => console.log(err));
 