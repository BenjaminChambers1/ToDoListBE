module.exports = async knex => {
    const users = process.env.DB_USERS;
    const exists = await knex.schema.hasTable(users);
    // const bcrypt = require('bcrypt');

    console.log(`Checking if the table ${users} exists in database.`);
    if (!exists) {
        console.log(`Creating table users in database.`);
        await knex.schema.createTable(users, (table) => {
            table.increments('id');
            table.string('username').notNullable();
            table.string('password').notNullable();
        });
    }
}