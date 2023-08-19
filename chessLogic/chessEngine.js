const { PIECE, VALUE, numToValue } = require('./constants');

class ChessEngine {
    constructor(game) {
        this.game = game;
        this.evaluationDepth = 4;
    }
    bestMove() {//return the next best move
        let moves = this.game.generateAllMoves();
        moves = this.orderMoves(moves);
        if (moves.length == 0) {//no move can be generated from this position
            if (this.game.inCheck(true)) {
                console.log('white loses');
            } else if (this.inCheck(false)) {
                console.log('black loses');
            }
            console.log('stalemate');
            return false;
        }
        let bestMove = false;
        let bestValue;
        let current;
        if (this.game.turn) {//white is moving
            bestValue = -Infinity;
            for (let i = 0; i < moves.length; i++) {
                this.game.makeMove(moves[i]);
                current = this.minMaxEvaluation(this.evaluationDepth, false, -Infinity, +Infinity);
                this.game.undoMove();
                if (current > bestValue) {
                    bestValue = current;
                    bestMove = moves[i];
                }
            }
        } else {//black is moving
            bestValue = +Infinity;
            for (let i = 0; i < moves.length; i++) {
                this.game.makeMove(moves[i]);
                current = this.minMaxEvaluation(this.evaluationDepth, true, -Infinity, +Infinity);
                this.game.undoMove();
                if (current < bestValue) {
                    bestValue = current;
                    bestMove = moves[i];
                }
            }
        }
        if (bestMove == false) {
            console.log('game over, no possible moves');
        }
        return bestMove;
    }

    minMaxEvaluation(depth, max, alpha, beta) {//returns a more advanced evaluation using the minimax algorithm
        let moves;
        let current;

        if (depth == 0) {
            return this.staticEvaluation();
        }
        moves = this.game.generateAllMoves();
        moves = this.orderMoves(moves);

        if (moves.length == 0) {//there are no moves that can be made from the position
            if (this.game.turn == true) {//it is whites turn
                if (this.game.inCheck(true)) {
                    return -Infinity;
                }
            } else {
                if (this.game.inCheck(false)) {
                    return Infinity;
                }
            }
            return 0;
        }
        if (max) {
            let highest = -Infinity;
            for (let i = 0; i < moves.length; i++) {
                this.game.makeMove(moves[i]);
                current = this.minMaxEvaluation(depth - 1, !max, alpha, beta);
                this.game.undoMove();
                highest = Math.max(current, highest);
                alpha = Math.max(current, alpha);
                if (beta <= alpha) {
                    break;
                }
            }
            return highest;
        } else {
            let lowest = +Infinity;
            for (let i = 0; i < moves.length; i++) {
                this.game.makeMove(moves[i]);
                current = this.minMaxEvaluation(depth - 1, !max, alpha, beta);
                this.game.undoMove();
                lowest = Math.min(current, lowest);
                beta = Math.min(current, beta);
                if (beta <= alpha) {
                    break;
                }
            }
            return lowest;
        }
    }

    orderMoves(moves) {
        /*
        takes an array 'moves'
        returns the moves ordered from best to worst
        the best moves are moves where a low value piece captures a high value piece
        the value of a move is val of piece captured - val of piece moving
        */
        return moves.sort((a, b) => {
            let movingPieceA = this.game.board[a.source];
            let capturedPieceA = this.game.board[a.capturedPiece];

            let movingPieceB = this.game.board[b.source];
            let capturedPieceB = this.game.board[b.capturedPiece];

            let aValue = numToValue[capturedPieceA] - numToValue[movingPieceA];
            let bValue = numToValue[capturedPieceB] - numToValue[movingPieceB];

            return aValue - bValue;
        });
    }

    onlyCaptures(moves) {
        /*
        takes an array 'moves'
        returns an array that contains only capture moves
        a capture move can easily be verified if move.capturedPiece != PIECE.empty
        */
        return moves.filter((move) => {
            if (move.capturedPiece != PIECE.EMPTY) {
                return true;
            }
            return false;
        })
    }

    staticEvaluation(alpha = -Infinity, beta = +Infinity) {
        return this.simpleStaticEvaluation();
        // let current;

        // let moves = this.game.generateAllMoves();
        // moves = this.onlyCaptures(moves);

        // if (moves.length == 0) {
        //     return this.simpleStaticEvaluation();
        // }
        // if (this.turn) {//find the max
        //     let highest = -Infinity;
        //     for (let i = 0; i < moves.length; i++) {
        //         this.game.makeMove(moves[i]);
        //         current = this.staticEvaluation(alpha, beta);
        //         this.game.undoMove();
        //         highest = Math.max(current, highest);
        //         alpha = Math.max(current, alpha);
        //         if (beta <= alpha) {
        //             break;
        //         }
        //     }
        //     return highest;
        // } else if (!this.turn) {//find the min
        //     let lowest = Infinity;
        //     for (let i = 0; i < moves.length; i++) {
        //         this.game.makeMove(moves[i]);
        //         current = this.staticEvaluation(alpha, beta);
        //         this.game.undoMove();
        //         lowest = Math.min(current, lowest);
        //         beta = Math.min(current, beta);
        //         if (beta <= alpha) {
        //             break;
        //         }
        //     }
        //     return lowest;
        // }
    }

    simpleStaticEvaluation() {//return a simple static evaluation: numerical value
        return this.pieceValueEvaluation();
    }

    pieceValueEvaluation() {
        let blackPieceSum = 0;
        let whitePieceSum = 0;

        blackPieceSum += this['game']['piece'][PIECE.bP]['length'] * VALUE.pawn;
        blackPieceSum += this['game']['piece'][PIECE.bN]['length'] * VALUE.knight;
        blackPieceSum += this['game']['piece'][PIECE.bB]['length'] * VALUE.bishop;
        blackPieceSum += this['game']['piece'][PIECE.bR]['length'] * VALUE.rook;
        blackPieceSum += this['game']['piece'][PIECE.bQ]['length'] * VALUE.queen;

        whitePieceSum += this['game']['piece'][PIECE.wP]['length'] * VALUE.pawn;
        whitePieceSum += this['game']['piece'][PIECE.wN]['length'] * VALUE.knight;
        whitePieceSum += this['game']['piece'][PIECE.wB]['length'] * VALUE.bishop;
        whitePieceSum += this['game']['piece'][PIECE.wR]['length'] * VALUE.rook;
        whitePieceSum += this['game']['piece'][PIECE.wQ]['length'] * VALUE.queen;

        return whitePieceSum - blackPieceSum;
    }
}

module.exports = {
    ChessEngine
}