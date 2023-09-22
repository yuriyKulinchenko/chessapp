const express = require('express');
const { User, validateUser, writeUser } = require('../model');
const router = express.Router();

router.post('/createAccount', async (req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;
        console.log(username);
        console.log(password);
        const madeAccount = await User.findOne({ username });
        if (madeAccount !== null) {
            res.send({ status: 'Username already exists' });
        } else {
            writeUser(username, password);
            res.send({ status: 'New account created' });
        }
    } catch (err) {
        console.log(err);
        res.send({ status: 'error' });
    }
});

router.post('/logIn', async (req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;
        const isMatch = await validateUser(username, password);
        if (isMatch) {
            res.send({ status: 'Logged in' });
        } else {
            res.send({ status: 'Incorrect username or password' });
        }
    } catch (err) {
        console.log(err);
    }
});

module.exports = router;