const path = require("path");

require("dotenv").config({
    path: path.join(__dirname, "..", ".env")
});

const bcrypt = require("bcryptjs");
const AdminModel = require("../src/model/AdminModel");
const db = require("../src/configuracao/db");

async function main() {
    const [email, novaSenha] = process.argv.slice(2);

    if (!email || !novaSenha) {
        console.log(
            'Uso: node scripts/redefinirSenha.js "email@senai.br" "NovaSenha123"'
        );
        process.exit(1);
    }

    const emailNormalizado = email.trim().toLowerCase();

    const admin = await AdminModel.buscarPorEmail(emailNormalizado);

    if (!admin) {
        console.log(`Nenhum administrador encontrado com o e-mail ${emailNormalizado}.`);
        process.exit(1);
    }

    const senhaHash = await bcrypt.hash(novaSenha, 10);

    await db.query(
        "UPDATE administradores SET senha_hash = ? WHERE id = ?",
        [senhaHash, admin.id]
    );

    console.log("Senha redefinida com sucesso!");
    console.log(`Administrador: ${admin.nome}`);
    console.log(`E-mail: ${admin.email}`);

    await db.end();
    process.exit(0);
}

main().catch(async (erro) => {
    console.error("Erro ao redefinir senha:", erro);

    try {
        await db.end();
    } catch (_) {}

    process.exit(1);
});