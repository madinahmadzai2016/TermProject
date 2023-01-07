const checkUsername = (username) => {
    /**
     * regex explanation
     * 
     * ^ --> start of string
     * \D --> anything NOT a digit [^0-9]
     * \w --> anything that is an alphanumeric character [a-zA-Z0-9]
     * {2,} --> 2 or more characters with no upper limit
     */
    let usernameChecker = /^\D\w{2,}$/;
    return usernameChecker.test(username);

}

const checkPassword = (password) => {
     let passwordChecker = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;
     return passwordChecker.test(password);
}

const checkEmail = (email) => {
    let emailChecker = /(.+)@(.+){2,}\.(.+){2,}/;
    return emailChecker.test(email);
}

const registerValidator = (req, res, next) => {
    let username = req.body.username;
    let password = req.body.password;
    let email = req.body.email;

    if(!checkUsername(username)) {
        req.flash('error', "Invalid username!");
        req.session.save(err => {
            res.redirect("/registration");
        });
    } else if(!checkPassword(password)) {
        req.flash('error', "Invalid password!");
        req.session.save(err => {
            res.redirect("/registration");
        });
    } else if(!checkEmail(email)) {
        req.flash('error', "Invalid email!");
        req.session.save(err => {
            res.redirect("/registration");
        });
    } else {
        next();
    }
}


const loginValidator = (req, res, next) => {
    let username = req.body.username;
    let password = req.body.password;

    if(username.length < 1) {
        req.flash('error', "Enter a username!");
        req.session.save(err => {
            res.redirect("/login");
        });
    } else if(password.length < 1) {
        req.flash('error', "Enter a password!");
        req.session.save(err => {
            res.redirect("/login");
        });
    }
    else {
        next();
    }
}

module.exports = {registerValidator, loginValidator}