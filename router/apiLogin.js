var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');

var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = require('../config');

// Require School model in our routes module
let UserLogin = require('../model/user.model');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:false}));

var verifyToken = function(req, res, next){
  
  var token = req.headers['x-token'];
  if (!token) {
    res.status(200).json({ resType: 'failed', message: 'No token provided.' });
  }
  else{
    jwt.verify(token, config.secret, function(err, decoded) {
      if (err) {
        res.status(200).json({ resType: 'failed', message: 'Failed to authenticate token.' });
      }
      else{
        res.locals.decoded = decoded; 
        next();
      } 
    });
  }
}

router.post('/api/checkLogin', function(req,res){
    //var hashedPassword = bcrypt.hashSync(req.body.Password, 8);

  UserLogin.findOne({Email: String(req.body.UserId)})
  .exec()
  .then(function(UserLogin) {
    console.log(UserLogin);
     bcrypt.compare(req.body.Password, UserLogin.Password, function(err, result){
        if(err) {
            console.log(err);
            res.status(200).json({
              resType: 'failed',
              message: 'Unauthorized Access'
           });
        }
 
        if(result) {
            console.log(result);
            var token = jwt.sign({ id: UserLogin._id, email: UserLogin.Email, userType: 'Admin' }, config.secret, {
                expiresIn: 86400 // expires in 24 hours
              });

            res.status(200).json({
                resType: 'success',
                token: token
           });

        }
        else{
          return res.status(200).json({
              resType: 'failed',
              message: 'Unauthorized Access'
          });
        }
        
     });
  })
  .catch(error => {
    
     return res.status(200).json({
        resType: 'failed',
        message: 'Unauthorized Access',
        error: error
     });
     
  });
  
});



router.get('/api/checkSession', verifyToken, function(req,res){
  if(res.locals.decoded.userType === 'Admin'){
    res.status(200).json({
      resType: 'success',
      message: 'wellcome'
    });
  }
  else{
    res.status(200).json({
      resType: 'failed',
      message: 'you have no permission'
    });
  }
  

});

module.exports = router;
