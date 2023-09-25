module.exports = async knex => {
    const todo_items = process.env.DB_TODO_ITEMS;
    const exists = await knex.schema.hasTable(todo_items);

    console.log(`Checking if the table ${todo_items} exists in database.`);
    if (!exists) {
        console.log(`Creating table todo_lists in database.`);
        await knex.schema.createTable(todo_items, (table) => {
            table.increments('id');
            table.integer('list_id');
            table.string('content');
        });
    }
}