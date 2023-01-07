var express = require('express');
var router = express.Router();
var isLoggedIn = require('../middleware/routeprotectors').userIsLoggedIn;
var {getRecentPosts, getPostById, getCommentsByPostId} = require('../middleware/postsmiddleware');
/* GET home page. */
router.get('/', getRecentPosts, function(req, res, next) {
  res.render('index', { title: 'CSC 317 App', name:"Madina Ahmadzai" });
});

module.exports = router;
router.get('/login',(req,res,next) => {
  res.render('login', {title: 'Login'})
})

router.get('/registration',(req,res,next) => {
  res.render('registration', {title: 'Registration'})
})
router.use('/postimage', isLoggedIn);
router.get('/postimage',(req,res,next) => {
  res.render('postimage', {title: 'Post'})
})

router.get('/viewpost',(req,res,next) => {
  res.render('viewpost', {title: 'ViewPost'})
});
router.get('/post/:id(\\d+)', getPostById,getCommentsByPostId, (req,res,next) => {

  res.render('viewpost',{title: `Post ${req.params.id}`})



})
module.exports = router;