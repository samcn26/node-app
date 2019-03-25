// 导航守卫
module.exports = {
    ensureAuthenticated: (req, res, next) => {
        if (req.isAuthenticated()) {
            return next();
        }
        req.flash("error_msg", "log in first");
        res.redirect("/users/login")
    }
}