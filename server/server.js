const mongoose = require('mongoose');
const express = require('express');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const { Chess } = require('./chessLogic/chess');
const { ChessEngine } = require('./chessLogic/chessEngine');
const expressWs = require('express-ws');

require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
})


const User = mongoose.model('User', userSchema);

const writeUser = async (username, password) => {
    try {
        let hashedPassword = await bcrypt.hash(password, 10);

        let user = new User({
            username: username,
            password: hashedPassword
        })

        await user.save();
        console.log('saved successfuly!');
    } catch (err) {
        console.log(err);
    }

}

const validateUser = async (username, password) => {
    try {
        let user = await User.findOne({ username });

        if (user === null) {
            console.log('user does not exist');
            return false;
        }

        user = user.toObject();

        let isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) return true;
        else return false;

    } catch (err) {
        console.log(err);
        return false;
    }
}

const app = express();
expressWs(app);

app.use(cors());
app.use(express.json());

app.post('/createAccount', async (req, res) => {
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
})

app.post('/logIn', async (req, res) => {
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
})

app.ws('/chessBot', (ws, req) => {

    let game = new Chess();
    let engine = new ChessEngine(game);
    ws.send(JSON.stringify({ board: game.board }));

    ws.on('message', (message) => {
        //get the game id
        const { from, to } = JSON.parse(message.toString());
        let move = game.generateManualMove(from, to);
        if (move) {
            game.makeMove(move);
            ws.send(JSON.stringify({ board: game.board }));
            let bestMove = engine.bestMove();
            setTimeout(() => {
                game.makeMove(bestMove);
                ws.send(JSON.stringify({ board: game.board }));
            }, 1000);
        }
    })
})

let games = {};

app.ws('/createGame', (ws, req) => {
    //create a new game 
    let game = new Chess();

    //give the game an ID
    const gameID = uuidv4();
    const player1 = ws;
    games[gameID] = { game, player1 };

    //give the player an ID
    ws.send(JSON.stringify({ gameID, board: game.board }));

    //handle requests as normal
    ws.on('message', (message) => {
        const { from, to } = JSON.parse(message.toString());
        let move = game.generateManualMove(from, to);
        if (move && game.turn) {
            game.makeMove(move);
            player1.send(JSON.stringify({ gameID, board: game.board }));
            if (games[gameID].hasOwnProperty('player2')) {
                games[gameID].player2.send(JSON.stringify({ gameID, board: game.board }));
            }
        }
    })
})

app.ws('/joinGame', (ws, req) => {
    //extract the game ID
    const gameID = req.query.gameID;
    console.log(gameID);
    if (!games.hasOwnProperty(gameID)) {
        ws.send('invalid game id');
        ws.close();
    }
    let gameObject = games[gameID];
    gameObject.player2 = ws;
    let game = gameObject.game;

    //handle requests as normal

    ws.send(JSON.stringify({ gameID, board: game.board }));

    ws.on('message', (message) => {
        const { from, to } = JSON.parse(message.toString());
        let move = game.generateManualMove(from, to);
        if (move && !game.turn) {
            game.makeMove(move);
            ws.send(JSON.stringify({ gameID, board: game.board }));
            gameObject.player1.send(JSON.stringify({ gameID, board: game.board }));
        }
    })
})

const port = 3002;
app.listen(port, () => {
    console.log(`server listening on port ${port}`);
})
