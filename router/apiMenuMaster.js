var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
const multer = require('multer');
const cors = require('cors');

var jwt = require('jsonwebtoken');
var config = require('../config');

// Require Branch model in our routes module
const AdminMenu = require('../model/adminMenu.model');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:false}));

var verifyToken = function(req, res, next){
  
  var token = req.headers['x-token'];
  if (!token) {
    req.status = 200;
    const error = new Error("No token provided.");
    next(error);
  }
  else{
    jwt.verify(token, config.secret, function(err, decoded) {
      if (err) {
        req.status = 200;
        const error = new Error("Failed to authenticate token.");
        next(error);
      }
      else{
        res.locals.decoded = decoded; 
        next();
      } 
    });
  }
}

// Defined edit route
router.get('/api/getAdminMenuById/:id', verifyToken, async (req, res, next) => {
  if(res.locals.decoded.userType === 'Admin'){
    let id = req.params.id;

    const adminMenu = await AdminMenu.find({parentId: id});
    
    res.status(200).json({
      resType: 'success',
      message: '',
      adminMenu: adminMenu
    });

  }
  else{
    req.status = 200;
    const error = new Error("you have no permission.");
    next(error);
  }
  
});


module.exports = router;
