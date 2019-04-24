var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
const cors = require('cors');

var jwt = require('jsonwebtoken');
var config = require('../config');

// Require Branch model in our routes module

const Religion = require('../model/masters/religion.model');

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

router.post('/api/SaveReligion', verifyToken, async (req,res, next) => {
  
  if(res.locals.decoded.userType === 'Admin'){
    let data = req.body;

    let religion = new Religion(data);

    await religion.save();

    res.status(200).json({
      resType: 'success',
      message: 'religion saved',
      religion: religion
    });

  }
  else{
    req.status = 200;
    const error = new Error("you have no permission.");
    next(error);
  }
});

router.get('/api/getReligion', verifyToken, async (req,res, next) => {
  if(res.locals.decoded.userType === 'Admin'){

    const religion = await Religion.find();

      res.status(200).json({
        resType: 'success',
        religion: religion
      });
      
  }
  else{
    req.status = 200;
    const error = new Error("you have no permission.");
    next(error);
   }
});

// Defined edit route
router.get('/api/getReligionById/:id', verifyToken, async (req, res, next) => {
  if(res.locals.decoded.userType === 'Admin'){
    let id = req.params.id;

    const religion = await Religion.findById(id);

    res.status(200).json({
      resType: 'success',
      message: '',
      religion: religion
    });

  }
  else{
    req.status = 200;
    const error = new Error("you have no permission.");
    next(error);
  }
  
});

//  Defined update route
router.post('/api/updateReligionById/:id', verifyToken, async (req, res, next) => {
  if(res.locals.decoded.userType === 'Admin'){

    const religion = await Religion.findById(req.params.id);

    religion.religionName = req.body.religionName;

    await religion.save();

    res.status(200).json({
      resType: 'success',
      message: 'religion updated',
      religion: religion
    });

  }
  else{
    req.status = 200;
    const error = new Error("you have no permission.");
    next(error);
  }
 
});

router.delete('/api/deleteReligion/:id',verifyToken, async (req, res, next) => {
  if(res.locals.decoded.userType === 'Admin'){
    
    const religion = await Religion.findByIdAndRemove({_id: req.params.id});
    
    res.status(200).json({
      resType: 'success',
      message: 'religion removed',
      religion: religion
    });

  }
  else{
    req.status = 200;
    const error = new Error("you have no permission.");
    next(error);
  }
});

module.exports = router;
