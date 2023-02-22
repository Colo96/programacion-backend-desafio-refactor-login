const passport = require('passport');
const usersModel = require('../models/users.models');
const { hashPassword, isValidPassword } = require('../utils/utils');
const LocalStrategy = require('passport-local').Strategy;
const GithubStrategy = require('passport-github2').Strategy;

passport.use('login', new LocalStrategy(
    { usernameField: 'email' },
    async (username, password, done) => {
        try {
            const user = await usersModel.findOne({ email: username });
            if (!user) {
                done(null, false);
            } else {
                if (!isValidPassword(user, password)) {
                    done(null, false);
                } else {
                    const sessionUser = {
                        _id: user._id,
                        first_name: user.first_name,
                        last_name: user.last_name,
                        age: user.age,
                        email: user.email
                    }
                    done(null, sessionUser);
                }
            }
        } catch (error) {
            done(error);
        }
    }
));

passport.use('register', new LocalStrategy(
    { passReqToCallback: true, usernameField: 'email' },
    async (req, username, password, done) => {
        const { first_name, last_name, age } = req.body;
        try {
            const user = await usersModel.findOne({ email: username });
            if (user) {
                done(null, false);
            } else {
                const newUser = {
                    first_name,
                    last_name,
                    age,
                    email: username,
                    password: hashPassword(password)
                };
                const userDB = await usersModel.create(newUser);
                const sessionUser = {
                    _id: userDB._id,
                    first_name: userDB.first_name,
                    last_name: userDB.last_name,
                    age: userDB.age,
                    email: userDB.email
                }
                done(null, sessionUser);
            }
        } catch (error) {
            done(error);
        }
    }
));

passport.use(new GithubStrategy(
    {
        clientID: 'Iv1.fa385e5f07a97079',
        clientSecret: 'db857bce80b3d391bf9dc204811a27b8fc3230b4',
        callbackURL: 'http://localhost:8080/api/sessions/github/callback'
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            // console.log(profile);
            const userData = profile._json;
            const user = await usersModel.findOne({ email: userData.email });
            if (!user) {
                const newUser = {
                    first_name: userData.name.split(" ")[0],
                    last_name: userData.name.split(" ")[1],
                    age: userData.age || null,
                    email: userData.email || null,
                    password: null,
                    githubLogin: userData.login
                };
                const response = await usersModel.create(newUser);
                done(null, response._doc);
            } else {
                done(null, user);
            }
        } catch (error) {
            done(error);
        }
    }
));

passport.serializeUser((user, done) => {
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    const user = await usersModel.findById(id);
    done(null, user);
});

module.exports = passport;