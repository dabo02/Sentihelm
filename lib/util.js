var Parse = require('./db');

module.exports.restrict = function restrict(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.status(401).send("You don't have access to this action");
    }
}
