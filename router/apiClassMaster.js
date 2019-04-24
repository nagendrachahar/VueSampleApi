var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
const cors = require('cors');

var jwt = require('jsonwebtoken');
var config = require('../config');

// Require Branch model in our routes module

const Class = require('../model/masters/class.model');

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

router.post('/api/SaveClass', verifyToken, async (req,res, next) => {
  
  if(res.locals.decoded.userType === 'Admin'){
    let data = req.body;

    let newClass = new Class(data);

    await newClass.save();

    res.status(200).json({
      resType: 'success',
      message: 'new Class saved',
      class: newClass
    });

  }
  else{
    req.status = 200;
    const error = new Error("you have no permission.");
    next(error);
  }
});

router.get('/api/getClass', verifyToken, async (req,res, next) => {
  if(res.locals.decoded.userType === 'Admin'){

    const newClass = await Class.find();

      res.status(200).json({
        resType: 'success',
        class: newClass
      });
      
  }
  else{
    req.status = 200;
    const error = new Error("you have no permission.");
    next(error);
   }
});

// Defined edit route
router.get('/api/getClassById/:id', verifyToken, async (req, res, next) => {
  if(res.locals.decoded.userType === 'Admin'){
    let id = req.params.id;

    const newClass = await Class.findById(id);

    res.status(200).json({
      resType: 'success',
      message: '',
      class: newClass
    });

  }
  else{
    req.status = 200;
    const error = new Error("you have no permission.");
    next(error);
  }
  
});

//  Defined update route
router.post('/api/updateClassById/:id', verifyToken, async (req, res, next) => {
  if(res.locals.decoded.userType === 'Admin'){

    const editClass = await Class.findById(req.params.id);

    editClass.className = req.body.className;
    editClass.classNumeric = req.body.classNumeric;
    editClass.classTeacherId = req.body.classTeacherId;

    await editClass.save();

    res.status(200).json({
      resType: 'success',
      message: 'class updated',
      class: editClass
    });

  }
  else{
    req.status = 200;
    const error = new Error("you have no permission.");
    next(error);
  }
 
});

router.delete('/api/deleteClass/:id',verifyToken, async (req, res, next) => {
  if(res.locals.decoded.userType === 'Admin'){
    
    const newClass = await Class.findByIdAndRemove({_id: req.params.id});
    
    res.status(200).json({
      resType: 'success',
      message: 'Class removed',
      class: newClass
    });

  }
  else{
    req.status = 200;
    const error = new Error("you have no permission.");
    next(error);
  }
});

module.exports = router;
