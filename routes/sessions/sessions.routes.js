const { Router } = require('express');
const router = Router();
const usersModel = require('../../models/users.models');
const { hashPassword, isValidPassword } = require('../../utils/utils');
const passport = require('../../middlewares/passport.middleware');

// router.post('/register', async (req, res) => {
//     try {
//         const { first_name, last_name, age, email, password } = req.body;
//         if (!first_name || !last_name || !age || !email || !password) {
//             return res.status(400).json({
//                 status: 'error',
//                 payload: 'Data is required'
//             });
//         }
//         const user = await usersModel.findOne({ email });
//         if (user) {
//             return res.status(400).json({
//                 status: 'error',
//                 payload: 'User already exists'
//             });
//         }
//         const newUser = {
//             first_name,
//             last_name,
//             age,
//             email,
//             password: hashPassword(password)
//         };
//         const response = await usersModel.create(newUser);
//         const sessionUser = {
//             _id: response._id,
//             first_name: response.first_name,
//             last_name: response.last_name,
//             age: response.age,
//             email: response.email
//         }
//         req.session.user = sessionUser;
//         req.session.save((error) => {
//             if (error) console.log("session error => ", error);
//             else {
//                 res.status(201).json({
//                     status: 'success',
//                     payload: sessionUser
//                 });
//             }
//         });
//     } catch (error) {
//         console.log(error);
//     }
// });


router.post('/register', passport.authenticate('register', { failureRedirect: '/' }), async (req, res) => {
    const sessionUser = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        age: req.user.age,
        email: req.user.email
    }
    req.session.user = sessionUser;
    res.json({
        status: 'success',
        payload: sessionUser
    });
});

// router.post('/login', async (req, res) => {
//     try {
//         const { email, password } = req.body;
//         if (!email || !password) {
//             return res.status(400).json({
//                 status: 'error',
//                 payload: 'Missing fields'
//             });
//         }
//         const user = await usersModel.findOne({ email: email });
//         if (!user) {
//             return res.status(400).json({
//                 status: 'error',
//                 payload: 'Wrong username or password'
//             });
//         }
//         if (!isValidPassword(user, password)) {
//             return res.status(400).json({
//                 status: 'error',
//                 payload: 'Wrong username or password'
//             });
//         }
//         const sessionUser = {
//             _id: user._id,
//             first_name: user.first_name,
//             last_name: user.last_name,
//             age: user.age,
//             email: user.email
//         }
//         req.session.user = sessionUser;
//         req.session.save((error) => {
//             if (error) console.log('session error => ', error);
//             else {
//                 res.status(201).json({
//                     status: 'success',
//                     payload: sessionUser
//                 });
//             }
//         });
//     } catch (error) {
//         console.log(error);
//     }
// });

router.post('/login', passport.authenticate('login', { failureRedirect: '/' }), async (req, res) => {
    if (!req.user) {
        return res.status(400).json({
            status: 'error',
            payload: 'Wrong username or password'
        });
    }
    const sessionUser = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        age: req.user.age,
        email: req.user.email
    }
    req.session.user = sessionUser;
    res.json({
        status: 'success',
        payload: sessionUser
    });
});

router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));

router.get('/github/callback', passport.authenticate('github', { failureRedirect: '/' }), async (req, res) => {
    const sessionUser = {
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        age: req.user.age,
        email: req.user.email
    }
    req.session.user = sessionUser;
    res.redirect('/profile');
});

router.get('/logout', async (req, res) => {
    req.session.destroy((error) => {
        if (error) {
            return res.json({ error: 'ERROR' });
        } else {
            res.clearCookie('demo');
            res.redirect('/');
        }
    });
});

module.exports = router;