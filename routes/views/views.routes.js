const { Router } = require('express');
const auth = require('../../middlewares/auth.middleware');
const sessionUser = require('../../middlewares/sessions.middleware');
const router = Router();

router.get('/', sessionUser, async (req, res) => {
    res.render('login');
});

router.get('/register', sessionUser, async (req, res) => {
    res.render('register');
});

router.get('/profile', auth, async (req, res) => {
    const user = await req.session.user;
    res.render('profile', { user });
});

module.exports = router;