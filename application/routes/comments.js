var express = require('express');
var router = express.Router();
const { errorPrint, successPrint } = require("../helpers/debug/debugprinters");
const {create} = require('../models/comments')

router.post('/create',(req,res,next) =>{



    if(!req.session.username){
        errorPrint("must be logged in to comment");
        res.json({
            code: -1,
            status: "danger",
            message: "Must be logged in"
        })
    }else{

        let {comment, postId} = req.body;
        let username = req.session.username;
        let userId = req.session.userId;
         create(userId,postId,comment)
         .then((wasSuccsessful) => {
             if (wasSuccsessful != -1){
                successPrint(`comment was created for ${username} `);
                res.json({
                    code: 1,
                    status: "success",
                    message: "comment created",
                    comment: comment,
                    username: username,
                    commentId: wasSuccsessful
                })
        
             }else{
                errorPrint("Comment was not saved!");
                res.json({
                    code: -1,
                    status: "danger",
                    message: "Comment was not created"
                })
        
             }
         })
         .catch((err) => next(err));
    }
})


module.exports = router;
