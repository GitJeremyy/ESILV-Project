const oracledb = require('oracledb');

async function initialize() {
    try {
        const connection = await oracledb.getConnection({
            user: 'admin_user',
            password: 'admin_password',
            connectString: 'localhost:1521/xepdb1'
        });
        return connection;
    } catch (err) {
        console.error('Failed connexion to the database:', err);
        process.exit(1);
    }
}

module.exports = { initialize };
