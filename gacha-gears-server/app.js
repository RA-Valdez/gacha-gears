require('dotenv').config();
//const crypto = require('node:crypto');
const express = require('express');
const path = require('path');
const connectDB = require('./config/db');
const cp = require('cookie-parser');
const cors = require('cors')
const userRouter = require('./routes/api/user');
const characterRouter = require('./routes/api/character');
const zoneRouter = require('./routes/api/zone');
const relicRouter = require('./routes/api/relic');
const ornamentRouter = require('./routes/api/ornament');
const buildRouter = require('./routes/api/build');

const app = express();
app.use(cp());
connectDB();
app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true, allowedHeaders: "origin, content-type, accept" }));
app.use(express.json({ extended: false }));

app.use(express.static(path.join(__dirname, 'client-dist')));

app.get('/', (req, res) => {
  res.send("Gacha Gears API Backend Test Successful")
});
app.use('/api/users', userRouter);
app.use('/api/characters', characterRouter);
app.use('/api/zones', zoneRouter);
app.use('/api/relics', relicRouter);
app.use('/api/ornaments', ornamentRouter);
app.use('/api/builds', buildRouter);
app.all('*', (req, res) => {
  res.status(404).send();
});

const port = process.env.PORT || 8082;

app.listen(port, () => console.log(`Server running on port ${port}`));
