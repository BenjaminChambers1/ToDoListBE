const router = require('express').Router();
const { authenticate_token } = require('../users/auth.js');

module.exports = knex => {
    const lists = require('./lists.js')(knex);

    router.post('/delete-item', authenticate_token, lists.delete_item);
    router.post('/get-lists', authenticate_token, lists.get_lists);
    router.post('/update-list', authenticate_token, lists.update_list);

    return router;
}