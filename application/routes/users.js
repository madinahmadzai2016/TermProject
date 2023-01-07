var express = require('express');
var router = express.Router();
var db = require('../conf/database');
var bcrypt = require('bcrypt')
const UserModle = require('../models/Users');
const UserError = require("../helpers/error/UserError");
const { errorPrint, successPrint } = require("../helpers/debug/debugprinters");
const UserModel = require('../models/Users');
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});


router.post('/register', (req, res, next) => {
  let password = req.body.password;
  let email = req.body.email;
  let username = req.body.username;



  UserModel.usernameExists(username)
    .then((userDoesNameExist) => {
      if (userDoesNameExist) {
        throw new UserError(
          "Registration Failed: Username already exists",
          "/registration",
          200
        );
      } else {
        return UserModel.emailExists(email);
      }
    })
    .then((emailDoesExist) => {
      if (emailDoesExist) {
        throw new UserError(
          "Registration Failed: Email already exists",
          "/registration",
          200);
      } else {
        UserModel.create(username, password, email);
      }
    })
    .then((createdUserId) => {
      if (createdUserId < 0) {
        throw new UserError(
          "Server Error, user could not be created",
          "/registration",
          500
        );
      } else {
        successPrint("User.js --> User was created!!")
        req.flash('success', 'User account has been made!')
        req.session.save(err => {
          res.redirect('/login');
        })
      }
    }).catch((err) => {
      errorPrint("user could not be made", err);
      if (err instanceof UserError) {
        errorPrint(err.getMessage());
        req.flash('error', err.getMessage())
        res.status(err.getStatus());
        res.redirect(err.getRedirectURL());
      } else {
        next(err);
      }
    });



});

router.post('/login', (req, res, next) => {
  let username = req.body.username
  let password = req.body.password;
  /**
 * 
 * do server side validation 
 * not done in video must do on your own 
 */

 UserModel.authenticate(username,password).then((loggedUserId) => {
      if (loggedUserId > 0) {
        successPrint(`User ${username} is logged in`);

        req.session.username = username;
        req.session.userId = loggedUserId;
        res.locals.logged = true; 

        req.flash('success', 'You have been successfully Logged in!')

        req.session.save(err => {
          res.redirect('/');
        })
      } else {
        throw new UserError("Invalid username and/or password!", "/login", 200)
      }
    })
    .catch((err) => {
      errorPrint("user Login Failed");
      if (err instanceof UserError) {
        errorPrint(err.getMessage());
        req.flash('error', err.getMessage())
        res.status(err.getStatus());
        res.redirect('/login')
      } else {
        next(err);
      }
    })
});



router.post('/logout', (req, res, next) => {
  req.session.destroy((err) => {
    if (err) {
      errorPrint('session could not be destroyed!')
      next(err);
    } else {
      successPrint('session has ended')
      res.clearCookie('csid');
      res.json({ status: "ok", message: "User is logged out" })
    }
  })

})
module.exports = router;


