var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
const cors = require('cors');

var jwt = require('jsonwebtoken');
var config = require('../config');

// Require Branch model in our routes module

const Designation = require('../model/masters/designation.model');

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

router.post('/api/SaveDesignation', verifyToken, async (req,res, next) => {
  
  if(res.locals.decoded.userType === 'Admin'){
    let data = req.body;

    let designation = new Designation(data);

    await designation.save();

    res.status(200).json({
      resType: 'success',
      message: 'designation saved',
      designation: designation
    });

  }
  else{
    req.status = 200;
    const error = new Error("you have no permission.");
    next(error);
  }
});

router.get('/api/getDesignation', verifyToken, async (req,res, next) => {
  if(res.locals.decoded.userType === 'Admin'){

    const designation = await Designation.find();

      res.status(200).json({
        resType: 'success',
        designation: designation
      });
      
  }
  else{
    req.status = 200;
    const error = new Error("you have no permission.");
    next(error);
   }
});

// Defined edit route
router.get('/api/getDesignationById/:id', verifyToken, async (req, res, next) => {
  if(res.locals.decoded.userType === 'Admin'){
    let id = req.params.id;

    const designation = await Designation.findById(id);

    res.status(200).json({
      resType: 'success',
      message: '',
      designation: designation
    });

  }
  else{
    req.status = 200;
    const error = new Error("you have no permission.");
    next(error);
  }
  
});

//  Defined update route
router.post('/api/updateDesignationById/:id', verifyToken, async (req, res, next) => {
  if(res.locals.decoded.userType === 'Admin'){

    const designation = await Designation.findById(req.params.id);

    designation.designationName = req.body.designationName;

    await designation.save();

    res.status(200).json({
      resType: 'success',
      message: 'designation updated',
      designation: designation
    });

  }
  else{
    req.status = 200;
    const error = new Error("you have no permission.");
    next(error);
  }
 
});

router.delete('/api/deleteDesignation/:id',verifyToken, async (req, res, next) => {
  if(res.locals.decoded.userType === 'Admin'){
    
    const designation = await Designation.findByIdAndRemove({_id: req.params.id});
    
    res.status(200).json({
      resType: 'success',
      message: 'designation removed',
      designation: designation
    });

  }
  else{
    req.status = 200;
    const error = new Error("you have no permission.");
    next(error);
  }
});

module.exports = router;
