
const express = require('express');
const cors = require('cors');
const expressWs = require('express-ws');

require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const userRoutes = require('./apiRoutes/user');
app.use('/api', userRoutes);

expressWs(app);
const gameRouter = require('./apiRoutes/game');
app.use('/api', gameRouter);

const port = 3002 || process.env.PORT;
app.listen(port, () => {
    console.log(`server listening on port ${port}`);
})
