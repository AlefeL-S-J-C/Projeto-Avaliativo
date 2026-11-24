const multer = require('multer');
const fs = require('fs');
const path = require('path');

const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

const extensoesAceitas = ['.jpeg', '.png'];
const mimesAceitos = ['image/jpeg', 'image/png'];

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
        const extensao = path.extname(file.originalname).toLowerCase();
        const nome = Date.now() + '-' + Math.round(Math.random() * 1000000000) + extensao;
        cb(null, nome);
    }
});

const fileFilter = function (req, file, cb) {
    const extensao = path.extname(file.originalname).toLowerCase();
    if (!extensoesAceitas.includes(extensao) || !mimesAceitos.includes(file.mimetype)) {
        cb(new Error('Formato de imagem inválido. Envie apenas arquivos .jpeg ou .png'));
        return;
    }
    cb(null, true);
};

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }
}).single('imagem');

module.exports = function uploadImagem(req, res, next) {
    upload(req, res, function (err) {
        if (err) {
            const mensagem = err.code === 'LIMIT_FILE_SIZE'
                ? 'A imagem deve ter no máximo 5 MB'
                : err.message;
            res.status(422).json({ message: mensagem });
            return;
        }
        next();
    });
};
