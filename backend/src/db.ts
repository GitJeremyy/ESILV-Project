import oracledb from 'oracledb';

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

interface DBConfig {
    user: string;
    password: string;
    connectString: string;
}

export async function initialize(): Promise<oracledb.Connection> {
    const config: DBConfig = {
        user: 'admin_user',
        password: 'admin_password',
        connectString: 'localhost:1521/xepdb1',
    };

    try {
        const connection = await oracledb.getConnection(config);
        //console.log('Successful connection to the database.');
        return connection;
    } catch (err) {
        //console.error('Failed connection to the database.', err);
        process.exit(1);
    }
}
