const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")

// load model
const User = mongoose.model("users")

module.exports = (passport) => {
    passport.use(new LocalStrategy(
        { usernameField: "email" },
        (email, passport, done) => {
            User.findOne({
                email: email
            }).then((user) => {
                if (user) {
                    // check pwd
                    bcrypt.compare(passport, user.password, (err, isMatch) => {
                        if (err) throw err;
                        if (isMatch) {
                            return done(null, user);
                        } else {
                            return done(null, false, { message: "password wrong" })
                        }
                    });
                } else {
                    // 1:是否传递内容， 2:user, 3:error message
                    return done(null, false, { message: "no user" })
                }
            })
        }
    ));

    // initialize & session
    passport.serializeUser((user, done) => {
        done(null, user.id);
      });
       
    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user);
        });
    });
}