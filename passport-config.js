const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const session = require("express-session");

function initialize( passport, getUserByEmail, getUserbyId) {
  const authenticateUser = async ( email, password, done) => {
    try {
      const user = await getUserByEmail(email);
      if (user == null) {
        return done(null, false, { message: "no user with that email" });
      }
      //console.log(`so far ${JSON.stringify(user)}`)
      if (await bcrypt.compare(password, user.userPassword)) {
        if (user.active) {
          session.user = user;
          console.log(session.user);
          return done(null, user);
        } else {
          console.log(`account activation pending: ${user.userEmail}`);
          
          return done(null, false, { message: "account activation pending" });
        }
      } else {
        console.log(`password incorrect: ${password}`);
  
        return done(null, false, { message: "password incorrect" });
      }
    } catch (error) {
      return done(null, false, { message: error });
    }
  };
  passport.use(new localStrategy({ usernameField: "email" }, authenticateUser));
  passport.serializeUser((user, done) => done(null, user.userId));
  passport.deserializeUser((id, done) => {
    return done(null, getUserbyId(id));
  });
}

module.exports = initialize;
