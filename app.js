require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://admin:Pyare132605@ucsbooks.t0qcvni.mongodb.net/UCSS',{
    useNewUrlParser: true,
    useUnifiedTopology: true
});
mongoose.set('strictQuery', false);
const port = process.env.PORT || 3000;
const userRoute = require('./routes/userRoute');
const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/', userRoute);
const http= require('http');
const server = http.createServer(app);
server.listen(port, () => console.log(`Listening on port ${port}`));