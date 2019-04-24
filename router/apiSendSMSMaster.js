var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
const sendSms = require("./sendSms")
const cors = require('cors');

var jwt = require('jsonwebtoken');
var config = require('../config');

// Require SMS model in our routes module

const SMS = require('../model/masters/sendSMS.model');
// Require Branch model in our routes module
const Parent = require('../model/parents/parent.model');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:false}));

router.use(cors());

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

router.post('/api/SaveSMS', verifyToken, async (req,res, next) => {
  
  if(res.locals.decoded.userType === 'Admin'){
    let data = req.body;

    let sms = new SMS(data);

    await sms.save();

    res.status(200).json({
      resType: 'success',
      message: 'sms saved',
      sms: sms
    });

  }
  else{
    req.status = 200;
    const error = new Error("you have no permission.");
    next(error);
  }
});

router.get('/api/getSMSList', verifyToken, async (req, res, next) => {
  if(res.locals.decoded.userType === 'Admin'){

    const sms = await SMS.find();

      res.status(200).json({
        resType: 'success',
        smsList: sms
      });
      
  }
  else{
    req.status = 200;
    const error = new Error("you have no permission.");
    next(error);
   }
});

router.delete('/api/deleteSMS/:id',verifyToken, async (req, res, next) => {
  if(res.locals.decoded.userType === 'Admin'){
    
    const sms = await SMS.findByIdAndRemove({_id: req.params.id});
    
    res.status(200).json({
      resType: 'success',
      message: 'sms removed',
      sms: sms
    });

  }
  else{
    req.status = 200;
    const error = new Error("you have no permission.");
    next(error);
  }
});


router.get('/api/sendSMS/:id',verifyToken, async (req, res, next) => {
  if(res.locals.decoded.userType === 'Admin'){
    
    const sms = await SMS.findById(req.params.id);
    
    const parent = await Parent.find();

    for(var i = 0; i<parent.length; i++){
      sendSms(sms.Message, parent[i].Phone);
    }

    
    res.status(200).json({
      resType: 'success',
      message: 'sms sent',
      sms: sms
    });

  }
  else{
    req.status = 200;
    const error = new Error("you have no permission.");
    next(error);
  }
});

module.exports = router;
