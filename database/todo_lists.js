module.exports = async knex => {
    const todo_lists = process.env.DB_TODO_LISTS;
    const exists = await knex.schema.hasTable(todo_lists);

    console.log(`Checking if the table ${todo_lists} exists in database.`);
    if (!exists) {
        console.log(`Creating table todo_lists in database.`);
        await knex.schema.createTable(todo_lists, (table) => {
            table.increments('id');
            table.integer('user_id');
            table.string('name');
        });
    }
}