const express = require('express');
const session = require('express-session');
const authMiddleware = require('./middlewares/auth.middleware');
const hanblebars = require("express-handlebars");
const path = require('path');
const apiRouter = require("./routes/app.routes");
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');
const passport = require('passport');

const PORT = process.env.PORT || 8080;

const app = express();

app.engine("handlebars", hanblebars.engine());
app.set('views', path.resolve(__dirname, './views'));
app.set("view engine", "handlebars");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.resolve(__dirname, './public')));

mongoose.set('strictQuery', false);
const database = require('./middlewares/database.middleware');
mongoose.connect(database.url, (error) => {
    if (error) {
        console.log("Cannot connect to database: " + error);
        process.exit();
    } else {
        console.log('Connected to MongoAtlas');
    }
});

app.use(session({
    name: 'demo',
    secret: 'x-files-51',
    cookie: {
        maxAge: 60000 * 60,
        httpOnly: true
    },
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
        mongoUrl: database.url,
        ttl: 60 * 60
    })
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/', apiRouter);

app.listen(PORT, () => {
    console.log('Server is up and running on port: ', PORT);
});

