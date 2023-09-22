
const express = require('express');
const cors = require('cors');
const expressWs = require('express-ws');
const path = require('path');

require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const userRoutes = require('./apiRoutes/user');
app.use('/api', userRoutes);

expressWs(app);
const gameRouter = require('./apiRoutes/game');
app.use('/api', gameRouter);

const port = process.env.PORT || 3002;
app.listen(port, () => {
    console.log(`server listening on port ${port}`);
})
