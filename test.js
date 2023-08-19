import React, { useState, useEffect } from "react";

const Component = () => {

    const [ws, setWs] = useState(null);
    const [text, setText] = useState('');

    useEffect(() => {
        let connection = new WebSocket('ws://localhost:3000');
        connection.on('message', (message) => {
            console.log(`new message received -> ${message}`);
        })
        setWs(connection);
    }, [])


    const handleClick = () => {
        ws.send(text);
    }

    return (
        <>
            <input type="text" value={text} onChange={(e) => { setText(e.target.value) }} />
            <button onClick={handleClick} >  send message </button>
        </>
    )
}

export default Component;