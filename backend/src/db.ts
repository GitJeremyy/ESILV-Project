import { Pool, PoolConfig } from 'pg';

const poolConfig: PoolConfig = {
    user: 'admin_user',
    host: 'localhost',
    database: 'hotel_management',
    password: 'admin_password',
    port: 5432,
};

const pool = new Pool(poolConfig);

export async function initialize() {
    try {
        const client = await pool.connect();
        console.log('Successful connection to the PostgreSQL database.');
        client.release();
    } catch (err) {
        console.error('Failed connection to the PostgreSQL database.', err);
        process.exit(1);
    }
}

export async function getConnection() {
    return pool.connect();
}