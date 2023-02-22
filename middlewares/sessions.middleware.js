const sessionUser = async (req, res, next) => {
    if (await req.session.user) {
        return res.redirect('/profile');
    }
    next();
};

module.exports = sessionUser;