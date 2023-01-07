const {errorPrint,successPrint} = require("../helpers/debug/debugprinters");
const routeProtectors ={};


//express-recv-reqest -> mw1 -> mw2 -> mw3 -> ...-> mwN -> router.HTTTPVERB
routeProtectors.userIsLoggedIn = function(req, res, next){
    if(req.session.username){
        successPrint('User is logged in');
        next();
    }else{
        errorPrint('user is not logged in!');
        req.flash('error', 'You must be logged in to create a post!');
        res.redirect('/login');
    }
}



module.exports= routeProtectors;