let knex;

const delete_item = async (req, res) => {
    let { item_id } = req.body;
    
    await knex(process.env.DB_TODO_ITEMS)
        .where({id: item_id})
        .delete()
        .catch(console.log);
    return res.json({message: 'item deleted'});
}

const get_lists = async (req, res) => {
    let { user_id } = req.body;
    let found_lists = await knex(process.env.DB_TODO_LISTS)
        .where({user_id})
        .catch(console.log);
    
    if (!found_lists.length) return res.json({message: 'No Lists Found'});

    let found_items = await knex(process.env.DB_TODO_ITEMS)
        .where({list_id : found_lists[0].id})
        .catch(console.log);

    return res.json(found_items);
}

const update_list = async (req, res) => {
    let { user_id, list_id, item, name } = req.body;
    if (!user_id) return res.status(400).json({
        message: 'Please log in to save changes to a list.'
    });

    let found_lists = await knex(process.env.DB_TODO_LISTS)
        .where({user_id})
        .catch(console.log);

    if (!found_lists.length) {
        let [ new_list_id ] = await knex(process.env.DB_TODO_LISTS)
            .insert({user_id, name})
            .returning('id')
            .catch(console.log);

        if (!new_list_id?.id) res.status(500).json({message: 'Error Creating List'});

        let [ new_item_id ] = await knex(process.env.DB_TODO_ITEMS)
            .insert({
                list_id: new_list_id.id,
                content: item
            })
            .returning('id')
            .catch(console.log);
        if (!new_item_id?.id) res.status(500).json({message: 'Error Creating Item'});

        return res.json({message: 'List Created with Item'});
    } else {
        let [ new_item_id ] = await knex(process.env.DB_TODO_ITEMS)
            .insert({
                list_id: found_lists[0].id,
                content: item
            })
            .returning('id')
            .catch(console.log);
        if (!new_item_id?.id) res.status(500).json({message: 'Error Creating Item'});
        return res.json({message: 'Item added to List'});
    }
}

module.exports = db => {
    knex = db;
    return {
        delete_item,
        get_lists,
        update_list
    }
}