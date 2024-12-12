const oracledb = require('oracledb');

async function initialize() {
    try {
        const connection = await oracledb.getConnection({
            user: 'admin_user',       // Remplace par ton utilisateur Oracle
            password: 'admin_password',   // Remplace par ton mot de passe
            connectString: 'localhost:1521/xepdb1'  // Remplace par ton adresse de connexion
        });

        console.log('Connexion à la base de données réussie!');
        return connection;
    } catch (err) {
        console.error('Erreur de connexion à la base de données:', err);
        process.exit(1);
    }
}

module.exports = { initialize };
