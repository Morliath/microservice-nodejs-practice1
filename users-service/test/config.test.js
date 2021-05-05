require('dotenv').config();
const config = require('../src/config');

describe('Apps has environment setup', () => {
    test('can obtain valid connection string for DB', () => {
        const connectionString = config.getDbConnectionString()
        expect(connectionString)
    })
})