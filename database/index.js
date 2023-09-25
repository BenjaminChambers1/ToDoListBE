module.exports = (knex) => {
    require('./users.js')(knex);
    require('./todo_lists.js')(knex);
    require('./todo_items.js')(knex);
    return knex;
}

