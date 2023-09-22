const API_URL = 'api';

export const API = {
    user: {
        login: `${API_URL}/login`,
        createAccount: `${API_URL}/createAccount`
    },
    game: {
        createGame: `${API_URL}/createGame`,
        joinGame: `${API_URL}/joinGame`,
        chessBot: `${API_URL}/chessBot`,
    }
};

export const getWsUrl = (apiPath) => {
    return `ws://${'localhost:3002'}/${apiPath}`;
};