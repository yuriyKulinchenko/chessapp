//NOTE: in this game, it is assumed that all promotions are to a queen

const { PIECE, OFFSET, CASTLEBIT } = require('./constants');

function isBlack(piece) {
    if (piece > 6 && piece < 13) { return true }
    return false;
}

function isWhite(piece) {
    if (piece > 0 && piece < 7) { return true }
    return false;
}

/*
moves are stored as an object with class 'move'
move.source represents the sourece of the move. for example, sq 21
move.destination represents the destination of the move. for example, sq 33
move.castlePermission represents the castle permission BEFORE the move is made
move.captured piece represents the captured piece. for example, PIECE.bN (8)
move.moveType represents the type of move:
0 for regular move, 
1 for capture,
2 for castle,
3 for en passant, 
4 for double pawn advance, 
5 for promotion
move.enPassant represents the en passant state BEFORE the move is made
specifically, move.enPassant gives the coordinate of the pawn that can be captured
*/

class Move {
    constructor(source, destination, castlePermission, capturedPiece, moveType, enPassant) {
        this.source = source; //98
        this.destination = destination; //72
        this.castlePermission = castlePermission; //0b1011
        this.capturedPiece = capturedPiece; //4
        this.moveType = moveType; //2
        this.enPassant = enPassant; //23
    }
}

class Chess {
    constructor() {
        this.board = new Array(120);
        this.piece = new Array(13);
        this.castlePermission = 0b1111;
        this.enPassant = null;
        this.history = [];
        this.turn = true; //true for white, false for black
        //enPassant stores the POSITION of the pawn that can be captured via en passant, if any
        this.init();
        //this['piece'][PIECE.wP] -> array containing positions of white pawns
    }
    init() {
        for (let i = 0; i < 120; i++) {
            this['board'][i] = PIECE.OOB;
        }
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                this['board'][(10 * i) + (j + 21)] = PIECE.EMPTY;
            }
        }
        for (let i = 31; i < 39; i++) {
            this['board'][i] = PIECE.wP; //white pawns
        }
        for (let i = 81; i < 89; i++) {
            this['board'][i] = PIECE.bP; //black pawns
        }
        //initialise black pieces
        this['board'][91] = PIECE.bR;
        this['board'][92] = PIECE.bN;
        this['board'][93] = PIECE.bB;
        this['board'][94] = PIECE.bQ;
        this['board'][95] = PIECE.bK;
        this['board'][96] = PIECE.bB;
        this['board'][97] = PIECE.bN;
        this['board'][98] = PIECE.bR;
        //initialise white pieces
        this['board'][21] = PIECE.wR;
        this['board'][22] = PIECE.wN;
        this['board'][23] = PIECE.wB;
        this['board'][24] = PIECE.wQ;
        this['board'][25] = PIECE.wK;
        this['board'][26] = PIECE.wB;
        this['board'][27] = PIECE.wN;
        this['board'][28] = PIECE.wR;

        this['piece'][PIECE.wP] = [31, 32, 33, 34, 35, 36, 37, 38];
        this['piece'][PIECE.wN] = [22, 27];
        this['piece'][PIECE.wB] = [23, 26];
        this['piece'][PIECE.wR] = [21, 28];
        this['piece'][PIECE.wQ] = [24];
        this['piece'][PIECE.wK] = [25];

        this['piece'][PIECE.bP] = [81, 82, 83, 84, 85, 86, 87, 88];
        this['piece'][PIECE.bN] = [92, 97];
        this['piece'][PIECE.bB] = [93, 96];
        this['piece'][PIECE.bR] = [91, 98];
        this['piece'][PIECE.bQ] = [94];
        this['piece'][PIECE.bK] = [95];

    }

    //note: en passant bits and castle bits can be accessed from 'this'

    //moves piece from source to destination, removing any piece that may be on the destination position
    movePiece(source, destination) {
        let movingPiece = this['board'][source];
        let capturedPiece = this['board'][destination];
        let index;
        this['board'][source] = PIECE.EMPTY;
        this['board'][destination] = movingPiece;
        if (movingPiece == 0) {
            console.log(`trying to move non-existent piece ${source} ${destination}`);
            console.log(this);
        }
        index = this['piece'][movingPiece].indexOf(source);
        if (index == -1) {
            console.log('error: trying to access piece that doesnt exist');
            console.log([source, destination, movingPiece, capturedPiece]);
            console.log(this['piece'][movingPiece]);
            console.log(this['board']);
        } else {
            this['piece'][movingPiece][index] = destination;
        }
        if (capturedPiece != PIECE.EMPTY) {
            index = this['piece'][capturedPiece].indexOf(destination);
            this['piece'][capturedPiece].splice(index, 1);
        }
    }

    placePiece(destination, pieceType) {
        if (this['board'][destination] != PIECE.EMPTY) {
            console.log("trying to place on full square");
            console.log(this['board'][destination]);
            console.log(this.board);
        }
        this['board'][destination] = pieceType;
        this['piece'][pieceType].push(destination);
    }

    removePiece(destination) {
        let pieceType = this['board'][destination];
        this['board'][destination] = PIECE.EMPTY;
        let index = this['piece'][pieceType].indexOf(destination);
        this['piece'][pieceType].splice(index, 1);
    }

    movePieceOnlyBoard(source, destination) {
        let pieceType = this['board'][source];
        this['board'][source] = PIECE.EMPTY;
        this['board'][destination] = pieceType;
    }

    placePieceOnlyBoard(destination, pieceType) {
        this['board'][destination] = pieceType;
    }

    removePieceOnlyBoard(destination) {
        this['board'][destination] = PIECE.EMPTY;
    }

    makeMove(move) {
        //variable init
        let source = move.source;
        let destination = move.destination;
        let moveType = move.moveType;
        let movingPiece = this['board'][source];
        //variable init end
        this['history'].push(move);
        this.turn = !this.turn;
        this.movePiece(source, destination);
        this.enPassant = 0; //by default
        //if rook moves, change castlebit
        if (movingPiece == PIECE.bR || movingPiece == PIECE.wR) {
            if (source == 21) {
                this.castlePermission = this.castlePermission ^ CASTLEBIT.WQCA;
            } else if (source == 28) {
                this.castlePermission = this.castlePermission ^ CASTLEBIT.WKCA;
            } else if (source == 91) {
                this.castlePermission = this.castlePermission ^ CASTLEBIT.BQCA;
            } else if (source == 98) {
                this.castlePermission = this.castlePermission ^ CASTLEBIT.BKCA;
            }
        }
        //if king moves, change castlebit
        if (movingPiece == PIECE.bK) {
            this.castlePermission = this.castlePermission ^ (CASTLEBIT.BKCA | CASTLEBIT.BQCA);
        } else if (movingPiece == PIECE.wK) {
            this.castlePermission = this.castlePermission ^ (CASTLEBIT.WKCA | CASTLEBIT.WQCA);
        }
        if (moveType == 2) {//castle
            if (destination == 27) {
                this.movePiece(28, 26);
            } else if (destination == 23) {
                this.movePiece(21, 24);
            } else if (destination == 97) {
                this.movePiece(98, 96);
            } else if (destination == 93) {
                this.movePiece(91, 94);
            }
        } else if (moveType == 3) {//en passant
            this.removePiece(move.enPassant);
        } else if (moveType == 4) {//double pawn advance
            this.enPassant = destination;
        } else if (moveType == 5) {//promotion
            this.removePiece(destination);
            if (movingPiece == PIECE.wP) {
                this.placePiece(destination, PIECE.wQ);
            } else {
                this.placePiece(destination, PIECE.bQ);
            }
        }
    }

    undoMove() {
        if (this.history.length == 0) {
            return false;
        }
        //find most recent move, initialise variables
        let move = this.history.pop();
        let source = move.source;
        let destination = move.destination;
        let moveType = move.moveType;
        let capturedPiece = move.capturedPiece;

        this.movePiece(destination, source);
        this.turn = !this.turn;
        this.enPassant = move.enPassant;
        this.castlePermission = move.castlePermission;

        if (moveType == 1) {//capture
            this.placePiece(destination, capturedPiece);
        } else if (moveType == 2) {//castle
            if (destination == 27) {
                this.movePiece(26, 28);
            } else if (destination == 23) {
                this.movePiece(24, 21);
            } else if (destination == 97) {
                this.movePiece(96, 98);
            } else if (destination == 93) {
                this.movePiece(94, 91);
            }
        } else if (moveType == 3) {//en passant
            if (this.turn) {
                this.placePiece(this.enPassant, PIECE.bP);
            } else {
                this.placePiece(this.enPassant, PIECE.wP);
            }
        } else if (moveType == 4) {//double pawn advance
            //nothing
        } else if (moveType == 5) {//promotion
            if (this['board'][source] == PIECE.wQ) {
                this.removePiece(source);
                this.placePiece(source, PIECE.wP);
            } else {
                this.removePiece(source);
                this.placePiece(source, PIECE.bP);
            }
            if (capturedPiece != PIECE.EMPTY) {
                this.placePiece(destination, capturedPiece);
            }
        }
    }

    makeMoveOnlyBoard(move) {
        //if the king moves, the pos should be updated
        this.turn = !this.turn;

        let source = move.source;
        let destination = move.destination;
        let moveType = move.moveType;
        let movingPiece = this['board'][source];

        this.movePieceOnlyBoard(source, destination);

        if (movingPiece == PIECE.wK || movingPiece == PIECE.bK) {
            this['piece'][movingPiece][0] = destination;
        }

        if (moveType == 2) {//castle
            if (destination == 27) {
                this.movePieceOnlyBoard(28, 26);
            } else if (destination == 23) {
                this.movePieceOnlyBoard(21, 24);
            } else if (destination == 97) {
                this.movePieceOnlyBoard(98, 96);
            } else if (destination == 93) {
                this.movePieceOnlyBoard(91, 94);
            }
        } else if (moveType == 3) {//en passant
            this.removePieceOnlyBoard(move.enPassant);
        } else if (moveType == 5) {//promotion
            this.removePieceOnlyBoard(destination);
            if (movingPiece == PIECE.wP) {
                this.placePieceOnlyBoard(destination, PIECE.wQ);
            } else {
                this.placePieceOnlyBoard(destination, PIECE.bQ);
            }
        }
    }

    undoMoveOnlyBoard(move) {
        this.turn = !this.turn;
        let source = move.source;
        let destination = move.destination;
        let moveType = move.moveType;
        let capturedPiece = move.capturedPiece;
        let movingPiece = this['board'][destination];

        if (movingPiece == PIECE.wK || movingPiece == PIECE.bK) {
            this['piece'][movingPiece][0] = source;
        }

        this.movePieceOnlyBoard(destination, source);

        if (moveType == 1) {//capture
            this.placePieceOnlyBoard(destination, capturedPiece);
        } else if (moveType == 2) {//castle
            if (destination == 27) {
                this.movePieceOnlyBoard(26, 28);
            } else if (destination == 23) {
                this.movePieceOnlyBoard(24, 21);
            } else if (destination == 97) {
                this.movePieceOnlyBoard(96, 98);
            } else if (destination == 93) {
                this.movePieceOnlyBoard(94, 91);
            }
        } else if (moveType == 3) {//en passant
            if (this.turn) {
                this.placePieceOnlyBoard(this.enPassant, PIECE.bP);
            } else {
                this.placePieceOnlyBoard(this.enPassant, PIECE.wP);
            }
        } else if (moveType == 5) {//promotion
            if (this['board'][source] == PIECE.wQ) {
                this.removePieceOnlyBoard(source);
                this.placePieceOnlyBoard(source, PIECE.wP);
            } else {
                this.removePieceOnlyBoard(source);
                this.placePieceOnlyBoard(source, PIECE.bP);
            }
            if (capturedPiece != PIECE.EMPTY) {
                this.placePieceOnlyBoard(destination, capturedPiece);
            }
        }
    }

    //'manualMove' allows a human to make a move from a source to a destination

    generateManualMove(src, dest) {//generates LEGAL move if possible
        if (src == dest) { return false }
        let move;
        let from = this['board'][src];
        let to = this['board'][dest];
        if (to == PIECE.OOB) {
            return false;
        }
        if (this.turn) { //verifies if the type of move is correct
            if (!isWhite(from)) { return false }
            if (isWhite(to)) { return false }
        } else {
            if (!isBlack(from)) { return false }
            if (isBlack(to)) { return false }
        }
        if (from == PIECE.wQ || from == PIECE.bQ) {
            move = this.generateManualMoveQueen(src, dest);
        }
        if (from == PIECE.wB || from == PIECE.bB) {
            move = this.generateManualMoveBishop(src, dest);
        }
        if (from == PIECE.wR || from == PIECE.bR) {
            move = this.generateManualMoveRook(src, dest);
        }
        if (from == PIECE.wN || from == PIECE.bN) {
            move = this.generateManualMoveKnight(src, dest);
        }
        if (from == PIECE.wP || from == PIECE.bP) {
            move = this.generateManualMovePawn(src, dest);
        }
        if (from == PIECE.wK || from == PIECE.bK) {
            move = this.generateManualMoveKing(src, dest);
        }
        if (move == false) {
            return false;
        }
        if (move == false) {
            return false;
        }
        if (this.isValidMove(move)) {
            return move;
        } else {
            return false;
        }
    }

    //------------------------------MANUAL MOVES------------------------------
    //TODO: queen move, bishop move and rook move can be condensed into one function 'sliding piece move'
    //pawn, king and knight have very specific move sets that are not worth generalising

    generateManualSlidingMove(src, dest, offset) {
        let cont = true;
        let i = src;
        for (let j = 0; j < offset.length; j++) {
            i = src + offset[j];
            cont = true;
            while (cont) {
                if (i == dest) {
                    if (this['board'][i] == PIECE.EMPTY) {
                        return new Move(src, dest, this.castlePermission, this['board'][dest], 0, this.enPassant);
                    } else {
                        return new Move(src, dest, this.castlePermission, this['board'][dest], 1, this.enPassant);
                    }
                } else {
                    if (this['board'][i] == PIECE.EMPTY) {
                        i = i + offset[j];
                    } else {
                        cont = false;
                    }
                }
            }
        }
        return false;
    }

    generateManualMoveQueen(src, dest) {
        return this.generateManualSlidingMove(src, dest, OFFSET.queenOffset);
    }

    generateManualMoveRook(src, dest) {
        return this.generateManualSlidingMove(src, dest, OFFSET.rookOffset);
    }

    generateManualMoveBishop(src, dest) {
        return this.generateManualSlidingMove(src, dest, OFFSET.bishopOffset);
    }


    //change movePawn and moveKing: too long and unreadable
    generateManualMovePawn(src, dest) {
        let capturedPiece = this['board'][dest];
        if (this['turn'] == true) { //if white
            if (capturedPiece == PIECE.EMPTY) {
                if (dest == 10 + src) {//regular pawn advance
                    if (dest > 90 && dest < 99) {//promotion
                        return new Move(src, dest, this.castlePermission, this['board'][dest], 5, this.enPassant);
                    }
                    return new Move(src, dest, this.castlePermission, this['board'][dest], 0, this.enPassant);
                }
                if (dest == 20 + src) {//pawn double advance
                    if (src > 30 && src < 39) {
                        return new Move(src, dest, this.castlePermission, this['board'][dest], 4, this.enPassant);
                    }
                }
                if (dest == src + 9 || dest == src + 11) {//en passant
                    if (dest == 10 + this.enPassant) {
                        return new Move(src, dest, this.castlePermission, this['board'][dest], 3, this.enPassant);
                    }
                }
            } else {
                if (dest == 9 + src || dest == 11 + src) {
                    if (dest > 90 && dest < 99) {//promotion
                        return new Move(src, dest, this.castlePermission, this['board'][dest], 5, this.enPassant);
                    }
                    return new Move(src, dest, this.castlePermission, this['board'][dest], 1, this.enPassant);
                }
            }
        } else { //if black
            if (capturedPiece == PIECE.EMPTY) {
                if (dest == -10 + src) {
                    if (dest > 20 && dest < 29) {//promotion
                        return new Move(src, dest, this.castlePermission, this['board'][dest], 5, this.enPassant);
                    }
                    return new Move(src, dest, this.castlePermission, this['board'][dest], 0, this.enPassant);
                }
                if (dest == -20 + src) {//pawn double advance
                    if (src > 80 && src < 89) {
                        return new Move(src, dest, this.castlePermission, this['board'][dest], 4, this.enPassant);
                    }
                }
                if (dest == -9 + src || dest == -11 + src) {
                    if (dest == -10 + this.enPassant) {
                        return new Move(src, dest, this.castlePermission, this['board'][dest], 3, this.enPassant);
                    }
                }
            } else {
                if (dest == -9 + src || dest == -11 + src) {
                    if (dest > 20 && dest < 29) {//promotion
                        return new Move(src, dest, this.castlePermission, this['board'][dest], 5, this.enPassant);
                    }
                    return new Move(src, dest, this.castlePermission, this['board'][dest], 1, this.enPassant);
                }
            }
        }
        return false;
    }

    generateManualMoveKing(src, dest) {
        let offset = OFFSET.kingOffset;
        for (let i = 0; i < offset.length; i++) {
            if (src + offset[i] == dest) {
                if (this['board'][dest] == PIECE.EMPTY) {
                    return new Move(src, dest, this.castlePermission, this['board'][dest], 0, this.enPassant);
                } else {
                    return new Move(src, dest, this.castlePermission, this['board'][dest], 1, this.enPassant);
                }
            }
        }
        //check for castling
        let squaresEmpty = true;
        let squaresSafe = true;
        let allowedToCastle = true;
        if (this.turn) {//if king is white
            if (dest == 27) {
                squaresEmpty = this['board'][26] == PIECE.EMPTY && this['board'][27] == PIECE.EMPTY;
                squaresSafe = !this.isVulnerable(26, true) && !this.isVulnerable(27, true);
                allowedToCastle = this.castlePermission & CASTLEBIT.WKCA != 0;
                if (squaresEmpty && squaresSafe && allowedToCastle) {
                    return new Move(src, dest, this.castlePermission, this['board'][dest], 2, this.enPassant);
                }
            } else if (dest == 23) {
                squaresEmpty = this['board'][24] == PIECE.EMPTY && this['board'][23] == PIECE.EMPTY && this['board'][22] == PIECE.EMPTY;
                squaresSafe = !this.isVulnerable(24, true) && !this.isVulnerable(23, true);
                allowedToCastle = (this.castlePermission & CASTLEBIT.WQCA) != 0;
                if (squaresEmpty && squaresSafe && allowedToCastle) {
                    return new Move(src, dest, this.castlePermission, this['board'][dest], 2, this.enPassant);
                }
            }
        } else {//if king is black
            if (dest == 97) {
                squaresEmpty = this['board'][96] == PIECE.EMPTY && this['board'][97] == PIECE.EMPTY;
                squaresSafe = !this.isVulnerable(96, false) && !this.isVulnerable(97, false);
                allowedToCastle = this.castlePermission & CASTLEBIT.BKCA != 0;
                if (squaresEmpty && squaresSafe && allowedToCastle) {
                    return new Move(src, dest, this.castlePermission, this['board'][dest], 2, this.enPassant);
                }
            } else if (dest == 93) {
                squaresEmpty = this['board'][94] == PIECE.EMPTY && this['board'][93] == PIECE.EMPTY && this['board'][92] == PIECE.EMPTY;
                squaresSafe = !this.isVulnerable(94, false) && !this.isVulnerable(93, false);
                allowedToCastle = this.castlePermission & CASTLEBIT.BQCA != 0;
                if (squaresEmpty && squaresSafe && allowedToCastle) {
                    return new Move(src, dest, this.castlePermission, this['board'][dest], 2, this.enPassant);
                }
            }
        }
        return false;
    }

    generateManualMoveKnight(src, dest) {
        let offset = OFFSET.knightOffset;
        for (let i = 0; i < offset.length; i++) {
            if (src + offset[i] == dest) {
                if (this['board'][dest] == PIECE.EMPTY) {
                    return new Move(src, dest, this.castlePermission, this['board'][dest], 0, this.enPassant);
                } else {
                    return new Move(src, dest, this.castlePermission, this['board'][dest], 1, this.enPassant);
                }
            }
        }
        return false;
    }


    validateBoard() {
        let kingPosition;
        if (this.turn) {//if it is whites turn, the black king cannot be in check
            kingPosition = this['piece'][PIECE.bK][0];
        } else {//if it is blacks turn, the white king cannot be in check
            kingPosition = this['piece'][PIECE.wK][0];
        }
        if (this.isVulnerable(kingPosition)) {
            return false;
        }
        return true;
    }

    inCheck(white) {
        let kingPosition = 0;
        if (white) {
            kingPosition = this['piece'][PIECE.wK][0];
        } else {
            kingPosition = this['piece'][PIECE.bK][0];
        }
        return this.isVulnerable(kingPosition);
    }

    //------------------------------AUTOMATED MOVES------------------------------

    //'generateMove' returns all pseudo-legal moves that can be made by the piece from a position

    generateSlidingMoves(position, offset) {
        let pieceIsWhite = isWhite(this['board'][position]);
        let currentOffset = offset[0];
        let cont = true;
        let i = 0;
        let possibleMoves = [];
        for (let j = 0; j < offset.length; j++) {
            currentOffset = offset[j];
            cont = true;
            i = position + currentOffset;
            while (cont) {
                if (this['board'][i] == PIECE.EMPTY) {
                    possibleMoves.push(new Move(position, i, this.castlePermission, this['board'][i], 0, this.enPassant));
                    i += currentOffset;
                } else {
                    if (pieceIsWhite && isBlack(this['board'][i])) {
                        possibleMoves.push(new Move(position, i, this.castlePermission, this['board'][i], 1, this.enPassant));
                    } else if (!pieceIsWhite && isWhite(this['board'][i])) {
                        possibleMoves.push(new Move(position, i, this.castlePermission, this['board'][i], 1, this.enPassant));
                    }
                    cont = false;
                }
            }
        }
        return possibleMoves;
    }

    generateMovesPawn(position) {
        let possibleMoves = [];
        let i;
        if (this['board'][position] == PIECE.wP) {
            //regular move OR queen promotion

            i = position + 10; //considering moving forwards

            if (this['board'][i] == PIECE.EMPTY) {
                if (i > 90 && i < 99) {
                    possibleMoves.push(new Move(position, i, this.castlePermission, this['board'][i], 5, this.enPassant));
                } else {
                    possibleMoves.push(new Move(position, i, this.castlePermission, this['board'][i], 0, this.enPassant));
                }
            }

            i = position + 9; //considering moving diagonal 1

            if (this['board'][i] == PIECE.EMPTY) {
                if (i - 10 == this.enPassant) {
                    possibleMoves.push(new Move(position, i, this.castlePermission, this['board'][i], 3, this.enPassant));
                }
            } else {
                if (isBlack(this['board'][i])) {
                    if (i > 90 && i < 99) {
                        possibleMoves.push(new Move(position, i, this.castlePermission, this['board'][i], 5, this.enPassant));
                    } else {
                        possibleMoves.push(new Move(position, i, this.castlePermission, this['board'][i], 1, this.enPassant));
                    }
                }
            }

            i = position + 11; //considering moving diagonal 2

            if (this['board'][i] == PIECE.EMPTY) {
                if (i - 10 == this.enPassant) {
                    possibleMoves.push(new Move(position, i, this.castlePermission, this['board'][i], 3, this.enPassant));
                }
            } else {
                if (isBlack(this['board'][i])) {
                    if (i > 90 && i < 99) {
                        possibleMoves.push(new Move(position, i, this.castlePermission, this['board'][i], 5, this.enPassant));
                    } else {
                        possibleMoves.push(new Move(position, i, this.castlePermission, this['board'][i], 1, this.enPassant));
                    }
                }
            }

            i = position + 20; //consider moving 2 places
            if (position > 30 && position < 39) {
                if (this['board'][i] == PIECE.EMPTY) {
                    if (this['board'][i - 10] == PIECE.EMPTY) {
                        possibleMoves.push(new Move(position, i, this.castlePermission, this['board'][i], 4, this.enPassant));
                    }
                }
            }

        } else if (this['board'][position] == PIECE.bP) {

            i = position - 10; //considering moving forwards

            if (this['board'][i] == PIECE.EMPTY) {
                if (i > 20 && i < 29) {
                    possibleMoves.push(new Move(position, i, this.castlePermission, this['board'][i], 5, this.enPassant));
                } else {
                    possibleMoves.push(new Move(position, i, this.castlePermission, this['board'][i], 0, this.enPassant));
                }
            }

            i = position - 9; //considering diagonal 1

            if (this['board'][i] == PIECE.EMPTY) {
                if (i + 10 == this.enPassant) {
                    possibleMoves.push(new Move(position, i, this.castlePermission, this['board'][i], 3, this.enPassant));
                }
            } else {
                if (isWhite(this['board'][i])) {
                    if (i > 20 && i < 29) {
                        possibleMoves.push(new Move(position, i, this.castlePermission, this['board'][i], 5, this.enPassant));
                    } else {
                        possibleMoves.push(new Move(position, i, this.castlePermission, this['board'][i], 1, this.enPassant));
                    }
                }
            }

            i = position - 11; //considering diagonal 2

            if (this['board'][i] == PIECE.EMPTY) {
                if (i + 10 == this.enPassant) {
                    possibleMoves.push(new Move(position, i, this.castlePermission, this['board'][i], 3, this.enPassant));
                }
            } else {
                if (isWhite(this['board'][i])) {
                    if (i > 20 && i < 29) {
                        possibleMoves.push(new Move(position, i, this.castlePermission, this['board'][i], 5, this.enPassant));
                    } else {
                        possibleMoves.push(new Move(position, i, this.castlePermission, this['board'][i], 1, this.enPassant));
                    }
                }
            }

            i = position - 20; //considering double pawn advance

            if (position > 80 && position < 89) {
                if (this['board'][i] == PIECE.EMPTY) {
                    if (this['board'][i + 10] == PIECE.EMPTY) {
                        possibleMoves.push(new Move(position, i, this.castlePermission, this['board'][i], 4, this.enPassant));
                    }
                }
            }

        }
        return possibleMoves;
    }

    generateMovesKing(position) {
        let pieceIsWhite = isWhite(this['board'][position]);
        let offset = OFFSET.kingOffset;
        let possibleMoves = [];
        let i = 0;
        for (let j = 0; j < offset.length; j++) {
            i = position + offset[j];
            if (this['board'][i] == PIECE.EMPTY) {
                possibleMoves.push(new Move(position, i, this.castlePermission, this['board'][i], 0, this.enPassant));
            } else {
                if (pieceIsWhite && isBlack(this['board'][i])) {
                    possibleMoves.push(new Move(position, i, this.castlePermission, this['board'][i], 1, this.enPassant));
                } else if (!pieceIsWhite && isWhite(this['board'][i])) {
                    possibleMoves.push(new Move(position, i, this.castlePermission, this['board'][i], 1, this.enPassant));
                }
            }
        }
        if (pieceIsWhite) {
            if (this.checkCastle(25, 27)) {
                possibleMoves.push(new Move(25, 27, this.castlePermission, PIECE.EMPTY, 2, this.enPassant));
            }
            if (this.checkCastle(25, 23)) {
                possibleMoves.push(new Move(25, 23, this.castlePermission, PIECE.EMPTY, 2, this.enPassant));
            }
        } else {
            if (this.checkCastle(95, 97)) {
                possibleMoves.push(new Move(95, 97, this.castlePermission, PIECE.EMPTY, 2, this.enPassant));
            }
            if (this.checkCastle(95, 93)) {
                possibleMoves.push(new Move(95, 93, this.castlePermission, PIECE.EMPTY, 2, this.enPassant));
            }
        }
        return possibleMoves;
    }

    generateMovesKnight(position) {
        let pieceIsWhite = isWhite(this['board'][position]);
        let offset = OFFSET.knightOffset;
        let possibleMoves = [];
        let i = 0;
        for (let j = 0; j < offset.length; j++) {
            i = position + offset[j];
            if (this['board'][i] == PIECE.EMPTY) {
                possibleMoves.push(new Move(position, i, this.castlePermission, this['board'][i], 0, this.enPassant));
            } else {
                if (pieceIsWhite && isBlack(this['board'][i])) {
                    possibleMoves.push(new Move(position, i, this.castlePermission, this['board'][i], 1, this.enPassant));
                } else if (!pieceIsWhite && isWhite(this['board'][i])) {
                    possibleMoves.push(new Move(position, i, this.castlePermission, this['board'][i], 1, this.enPassant));
                }
            }
        }
        return possibleMoves;
    }

    generateMovesQueen(position) {
        return this.generateSlidingMoves(position, OFFSET.queenOffset);
    }

    generateMovesRook(position) {
        return this.generateSlidingMoves(position, OFFSET.rookOffset);
    }

    generateMovesBishop(position) {
        return this.generateSlidingMoves(position, OFFSET.bishopOffset);
    }

    generateAllPseudoLegalMoves() {
        let moves = [];
        let kingPosition;
        let queenPosition;
        let pawnPosition;
        let rookPosition;
        let bishopPosition;
        let knightPosition;
        if (this.turn) {//if it is whites turn
            kingPosition = this['piece'][PIECE.wK];
            queenPosition = this['piece'][PIECE.wQ];
            pawnPosition = this['piece'][PIECE.wP];
            rookPosition = this['piece'][PIECE.wR];
            bishopPosition = this['piece'][PIECE.wB];
            knightPosition = this['piece'][PIECE.wN];
        } else {//if it is blacks turn  
            kingPosition = this['piece'][PIECE.bK];
            queenPosition = this['piece'][PIECE.bQ];
            pawnPosition = this['piece'][PIECE.bP];
            rookPosition = this['piece'][PIECE.bR];
            bishopPosition = this['piece'][PIECE.bB];
            knightPosition = this['piece'][PIECE.bN];
        }
        //ordered from least valuable to most valuable
        for (let i = 0; i < pawnPosition.length; i++) {
            moves.push(...this.generateMovesPawn(pawnPosition[i]));
        }
        for (let i = 0; i < knightPosition.length; i++) {
            moves.push(...this.generateMovesKnight(knightPosition[i]));
        }
        for (let i = 0; i < bishopPosition.length; i++) {
            moves.push(...this.generateMovesBishop(bishopPosition[i]));
        }
        for (let i = 0; i < rookPosition.length; i++) {
            moves.push(...this.generateMovesRook(rookPosition[i]));
        }
        for (let i = 0; i < kingPosition.length; i++) {
            moves.push(...this.generateMovesKing(kingPosition[i]));
        }
        for (let i = 0; i < queenPosition.length; i++) {
            moves.push(...this.generateMovesQueen(queenPosition[i]));
        }
        return moves;
    }

    generateAllMoves() {
        let legalMoves = [];
        let moves = this.generateAllPseudoLegalMoves();
        for (let i = 0; i < moves.length; i++) {
            if (this.isValidMove(moves[i])) {
                legalMoves.push(moves[i]);
            }
        }
        return legalMoves;
    }

    //it is inefficient to make a move to validate it


    isValidMove(move) {
        this.makeMoveOnlyBoard(move);
        let output = this.validateBoard();
        this.undoMoveOnlyBoard(move);
        return output;
    }

    isVulnerable(position, pieceIsWhite = null) {
        if (pieceIsWhite === null) {
            pieceIsWhite = isWhite(this['board'][position]);
        }
        if (pieceIsWhite) { //if white
            if (this.checkOffset(PIECE.bQ, OFFSET.queenOffset, position)) {
                return true;
            }
            if (this.checkOffset(PIECE.bR, OFFSET.rookOffset, position)) {
                return true;
            }
            if (this.checkOffset(PIECE.bB, OFFSET.bishopOffset, position)) {
                return true;
            }
            if (this.checkOffsetOneStep(PIECE.bN, OFFSET.knightOffset, position)) {
                return true;
            }
            if (this.checkOffsetOneStep(PIECE.bK, OFFSET.kingOffset, position)) {
                return true;
            }
            if (this.checkOffsetOneStep(PIECE.bP, OFFSET.blackPawnOffset, position)) {
                return true;
            }
        } else { //if black
            if (this.checkOffset(PIECE.wQ, OFFSET.queenOffset, position)) {
                return true;
            }
            if (this.checkOffset(PIECE.wR, OFFSET.rookOffset, position)) {
                return true;
            }
            if (this.checkOffset(PIECE.wB, OFFSET.bishopOffset, position)) {
                return true;
            }
            if (this.checkOffsetOneStep(PIECE.wN, OFFSET.knightOffset, position)) {
                return true;
            }
            if (this.checkOffsetOneStep(PIECE.wK, OFFSET.kingOffset, position)) {
                return true;
            }
            if (this.checkOffsetOneStep(PIECE.wP, OFFSET.whitePawnOffset, position)) {
                return true;
            }
        }
        return false;
    }

    //------------------------------HELPER FUNCTIONS------------------------------

    checkOffset(piece, offset, position) {//checks for piece in all offset directions from position (rooks, bishops, queens)
        let i;
        let cont = true;
        let currentOffset;
        for (let j = 0; j < offset.length; j++) {
            currentOffset = offset[j];
            i = position + currentOffset;
            cont = true;
            while (cont) {
                if (this['board'][i] == piece) {
                    return true;
                } else if (this['board'][i] != PIECE.EMPTY) {
                    cont = false;
                }
                i += currentOffset;
            }
        }
        return false;
    }

    checkOffsetOneStep(piece, offset, position) {//checks for piece in all offset directions by taking just one step (king, knight)
        let currentOffset;
        for (let i = 0; i < offset.length; i++) {
            currentOffset = offset[i];
            if (this['board'][position + currentOffset] == piece) {
                return true;
            }
        }
        return false;
    }

    checkCastle(source, destination) {//returns true if castle is legal
        let isEmpty = (position) => position == PIECE.EMPTY;
        let squaresEmpty = false;
        let squaresSafe = false;
        let allowedToCastle = false;
        let pieceIsWhite = isWhite(this['board'][source]);
        if (pieceIsWhite) {
            if (destination == 27) {
                squaresEmpty = isEmpty(26) && isEmpty(27);
                squaresSafe = !this.isVulnerable(26) && !this.isVulnerable(27);
                allowedToCastle = this.castlePermission & CASTLEBIT.WKCA != 0;
            } else if (destination == 23) {
                squaresEmpty = isEmpty(22) && isEmpty(23) && isEmpty(24);
                squaresSafe = !this.isVulnerable(23) && !this.isVulnerable(24);
                allowedToCastle = this.castlePermission & CASTLEBIT.WQCA != 0;
            }
        } else {
            if (destination == 97) {
                squaresEmpty = isEmpty(96) && isEmpty(97);
                squaresSafe = !this.isVulnerable(96) && !this.isVulnerable(97);
                allowedToCastle = this.castlePermission & CASTLEBIT.BKCA != 0;
            } else if (destination == 93) {
                squaresEmpty = isEmpty(92) && isEmpty(93) && isEmpty(94);
                squaresSafe = !this.isVulnerable(93) && !this.isVulnerable(94);
                allowedToCastle = this.castlePermission & CASTLEBIT.BQCA != 0;
            }
        }
        if (squaresEmpty && squaresSafe && allowedToCastle) {
            return true;
        }
    }
}

module.exports = {
    Move, Chess
}
