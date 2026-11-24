const fs = require('fs');
const path = require('path');

module.exports = function removerArquivo(nomeArquivo) {
    if (!nomeArquivo) {
        return;
    }
    const caminho = path.join(__dirname, '..', 'uploads', path.basename(nomeArquivo));
    fs.unlink(caminho, function (err) {
        if (err && err.code !== 'ENOENT') {
            console.log('Não foi possível remover a imagem antiga: ' + err);
        }
    });
};
