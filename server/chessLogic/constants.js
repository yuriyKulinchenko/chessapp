//------------------------------REGULAR CONSTANTS------------------------------

const PIECE = {
    EMPTY: 0, OOB: 13,
    wP: 1, wN: 2, wB: 3, wR: 4, wQ: 5, wK: 6, //white pieces
    bP: 7, bN: 8, bB: 9, bR: 10, bQ: 11, bK: 12 //black pieces
};

const CASTLEBIT = {
    WKCA: 1, WQCA: 2, //white castlebit
    BKCA: 4, BQCA: 8 //black castlebit
};

/*
Technically, the king and queen offset are identical. 
however, for readibility, they are considered to be 2 different offsets. 
The additional memory 'wasted' is negligible.
*/
const OFFSET = {
    rookOffset: [1, -1, 10, -10],
    bishopOffset: [-11, -9, 11, 9],
    knightOffset: [-8, -19, -21, -12, 8, 19, 21, 12],
    kingOffset: [1, -1, 10, -10, -11, -9, 11, 9],
    queenOffset: [1, -1, 10, -10, -11, -9, 11, 9],
    blackPawnOffset: [9, 11],
    whitePawnOffset: [-9, -11]
};

//------------------------------ENGINE CONSTANTS------------------------------

const VALUE = {
    pawn: 100,
    knight: 300,
    bishop: 300,
    rook: 500,
    queen: 900
}

const numToValue = [
    0,
    VALUE.pawn,
    VALUE.knight,
    VALUE.bishop,
    VALUE.queen,
    VALUE.pawn,
    VALUE.pawn,
    VALUE.knight,
    VALUE.bishop,
    VALUE.queen,
    VALUE.pawn
];

// numToValue[0] = 0;
// numToValue[1] = VALUE.pawn;
// numToValue[2] = VALUE.knight;
// numToValue[3] = VALUE.bishop;
// numToValue[4] = VALUE.rook;
// numToValue[5] = VALUE.queen;
// numToValue[6] = VALUE.pawn; //kings moves should be considered first 
// numToValue[7] = VALUE.pawn;
// numToValue[8] = VALUE.knight;
// numToValue[9] = VALUE.bishop;
// numToValue[10] = VALUE.rook;
// numToValue[11] = VALUE.queen;
// numToValue[12] = VALUE.pawn; //kings moves should be considered first 

module.exports = {
    PIECE, VALUE, CASTLEBIT, OFFSET, numToValue
}