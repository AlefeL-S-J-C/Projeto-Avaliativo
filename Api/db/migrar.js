const conn = require('./conn.js');

// Ajusta o schema legado da tabela VendaItems: remove FKs antigas e permite
// que produtoId fique nulo quando um produto é excluído.
module.exports = async function migrar() {
    const [foreignKeys] = await conn.query(
        "SELECT CONSTRAINT_NAME FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE " +
        "WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'VendaItems' " +
        "AND REFERENCED_TABLE_NAME IS NOT NULL"
    );

    for (const fk of foreignKeys) {
        await conn.query('ALTER TABLE `VendaItems` DROP FOREIGN KEY `' + fk.CONSTRAINT_NAME + '`');
    }

    await conn.query('ALTER TABLE `VendaItems` MODIFY `produtoId` INT NULL');
};
