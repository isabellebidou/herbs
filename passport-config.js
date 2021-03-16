const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const session = require("express-session");
const secret = require("./secret");
const db = secret.db;

function getUserByEmail(email){
    return new Promise(async (resolve, reject) => {
      try {
        //console.log(`making passport-config email request to db`);
        let sql = "select * FROM user WHERE userEmail = '" + email + "'";
        user = null;
        await db.query(sql, (err, rows) => {
          if (err) throw err;
          user = { ...rows[0] };
          if (rows.length) {
            resolve(user);
          } else reject(`no user with email:  ${email}`);
        });
      } catch (error) {
        console.error(error);
      }
    });
}
function getUserbyId(id){

    return new Promise(async (resolve, reject) => {
      try {
        //console.log(`making passport-config id request to db`);
        let sql = "select * FROM user WHERE userId = '" + id + "'";
        await db.query(sql, (err, rows) => {
          if (err) throw err;
          user = { ...rows[0] };
          if (user != null) resolve(user);
          else reject(`no user with id:  ${id}`);
        });
      } catch (error) {
        console.error(error);
      }
    });

}

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
          if (process.env.NODE_ENV !== "production") {
            console.log(session.user);
          }
          //console.log(session.user);
          return done(null, user);
        } else {
          //console.log(`account activation pending: ${user.userEmail}`);

          return done(null, false, { message: "account activation pending" });
        }
      } else {
        if (process.env.NODE_ENV !== "production") {
          console.log(`password incorrect: ${password}`);
        }
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

module.exports = {
  initialize,
  getUserByEmail,
  getUserbyId
};
