import React, { useState, useEffect } from "react"

import whitePawnImage from './../images/Chess_wP.png';
import whiteKnightImage from './../images/Chess_wN.png';
import whiteBishopImage from './../images/Chess_wB.png';
import whiteRookImage from './../images/Chess_wR.png';
import whiteQueenImage from './../images/Chess_wQ.png';
import whiteKingImage from './../images/Chess_wK.png';

import blackPawnImage from './../images/Chess_bP.png';
import blackKnightImage from './../images/Chess_bN.png';
import blackBishopImage from './../images/Chess_bB.png';
import blackRookImage from './../images/Chess_bR.png';
import blackQueenImage from './../images/Chess_bQ.png';
import blackKingImage from './../images/Chess_bK.png';

const ChessBoard = ({ display, callback, rotate = true }) => {

    const imageMap = [
        '',
        whitePawnImage,
        whiteKnightImage,
        whiteBishopImage,
        whiteRookImage,
        whiteQueenImage,
        whiteKingImage,
        blackPawnImage,
        blackKnightImage,
        blackBishopImage,
        blackRookImage,
        blackQueenImage,
        blackKingImage,
    ]

    const convert = (display) => {
        let out = [];
        for (let i = 21; i < 101; i += 10) {
            for (let j = 0; j < 8; j++) {
                out.push(display[i + j]);
            }
        }
        return out.map(element => imageMap[element]);
    }

    const defaultState = [13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 4, 2, 3, 5, 6, 3, 2, 4, 13, 13, 1, 1, 1, 1, 1, 1, 1, 1, 13, 13, 0, 0, 0, 0, 0, 0, 0, 0, 13, 13, 0, 0, 0, 0, 0, 0, 0, 0, 13, 13, 0, 0, 0, 0, 0, 0, 0, 0, 13, 13, 0, 0, 0, 0, 0, 0, 0, 0, 13, 13, 7, 7, 7, 7, 7, 7, 7, 7, 13, 13, 10, 8, 9, 11, 12, 9, 8, 10, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13];

    let [imageArray, setImageArray] = useState(convert(defaultState));
    let [borderIndex, setBorderIndex] = useState(-1);
    let [from, setFrom] = useState(null);
    let [to, setTo] = useState(null);

    useEffect(() => {
        setImageArray(convert(display));
    }, [display]);

    const generateClickHandler = (index) => {
        return () => {
            handleClick(index);
        }
    }
    const handleClick = (index) => {
        //handle each individual click
        let j = index % 8;
        let i = (index - j) / 8;
        let position = 21 + 10 * i + j;

        if (from === null) {
            //setting from
            setFrom(position)
            setBorderIndex(index);
        } else {
            //setting to
            setTo(position)
            setBorderIndex(-1);
            callback({ from, to: position });
            setFrom(null);
            setTo(null);
        }

    }

    let array = [];

    for (let i = 0, k = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            array.push(
                <div
                    onClick={generateClickHandler(k)}
                    key={k}
                    style={{
                        outline: (borderIndex === k ? '4px solid limegreen' : null),
                        zIndex: (borderIndex === k ? 10 : 0),
                        backgroundColor: ((i + j) % 2 === 0 ? '#8B4513' : '#D2B48C'),
                        transform: rotate ? 'scaleY(-1)' : 'scaleY(1)',
                        width: '12.5%',
                        height: '12.5%'
                    }}

                >
                    {(imageArray[k] !== '' ? <img
                        src={imageArray[k]}
                        alt=""
                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                    /> : null)}
                </div >)
            k++;
        }
    }
    return (
        <div style={{
            transform: rotate ? 'scaleY(-1)' : 'scaleY(1)',
            width: '80vh',
            height: '80vh',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'space-between',
            backgroundColor: '#8B4513',
        }}>
            {array}
        </div>
    )
}

export default ChessBoard; 