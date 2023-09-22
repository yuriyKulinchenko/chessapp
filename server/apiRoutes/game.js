
const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { Chess } = require('./../chessLogic/chess');
const { ChessEngine } = require('./../chessLogic/chessEngine');

const gameRouter = express.Router();
gameRouter.ws('/chessBot', (ws, req) => {
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
});

let games = {};

gameRouter.ws('/createGame', (ws, req) => {
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
});

gameRouter.ws('/joinGame', (ws, req) => {
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
});

module.exports = gameRouter;