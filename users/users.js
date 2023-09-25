let knex;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const log_in = async (req, res) => {
    const { username, password } = req.body;
    let found_user = await knex(process.env.DB_USERS)
        .where({username})
        .limit(1)
        .catch(console.log);

    if (found_user.length > 0) {
        let correct_password = await bcrypt.compare(password, found_user[0].password, );
        if (!correct_password) {
            return res.json({message: 'Username or Password Incorrect'});
        }
        let user = found_user[0];
        const access_token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
        return res.status(200).json({ id: user.id, access_token, username });
    }
    return res.json({message: 'Username or Password Incorrect'});
}

const sign_up = async (req, res) => {
    const { username, password } = req.body;
    if (!username.length || !password) res.json({message: 'Make sure you have entered a username and password before submitting'});
    let found_user = await knex(process.env.DB_USERS)
        .where({username})
        .limit(1)
        .catch(console.log);

    if (!found_user.length) {
        let created_password = await bcrypt.hash(password, 10);
        let [ created_user ] = await knex(process.env.DB_USERS)
            .insert({
                username: username,
                password: created_password
            })
            .returning('*')
            .catch(console.log);

        if (!created_user) return res.status(201).json({message: 'Unable to create Account'});
        const access_token = jwt.sign(created_user, process.env.ACCESS_TOKEN_SECRET);
        return res.json({ id: created_user.id, access_token, username, message: 'User was created successfully' });
    }
    return res.json({message: 'Username already exists'});
}

module.exports = db => {
    knex = db;
    return {
        log_in,
        sign_up
    }
}