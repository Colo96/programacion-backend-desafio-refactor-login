const auth = async (req, res, next) => {
    if (await req.session.user) {
        next();
    }
    else {
        res.json({ error: 'ERROR' });
    }
};

module.exports = auth;