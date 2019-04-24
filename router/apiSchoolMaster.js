var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
const multer = require('multer');
const cors = require('cors');

var jwt = require('jsonwebtoken');
var config = require('../config');

// Require School model in our routes module
let School = require('../model/school.model');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended:false}));

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'client/wwwroot')
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname)
  }
});

const upload = multer({ storage });
router.use(cors());

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

router.post('/api/SaveSchool', verifyToken, upload.single('image'), function(req,res){
  
  if(res.locals.decoded.userType === 'Admin'){
    let data = req.body;

    if(req.file){
      data["schoolLogo"] = req.file.filename;
    }
    else{
      data["schoolLogo"] = "";
    }
    
    let school = new School(data);

    school.save().then(school => {
      res.status(200).json({
        resType: 'success',
        message: 'school successfully saved'
      });
    })
    .catch(err => {
      res.status(200).json({
        resType: 'failed',
        message: err
      });
    });

  }
  else{
    res.status(200).json({
      resType: 'failed',
      message: 'you have no permission'
    });
  }
});


router.get('/api/getSchool', verifyToken, function(req,res){
  if(res.locals.decoded.userType === 'Admin'){
    School.find(function(err, school){
      if(err){
        res.status(200).json({
          resType: 'failed',
          message: 'Error'
        });
      }
      else {
        res.status(200).json({
          resType: 'success',
          message: '',
          school: school
        });
      }
    });
  }
  else{
    res.status(200).json({
      resType: 'failed',
      message: 'you have no permission'
    });
  }
  

});

// Defined edit route
router.get('/api/getSchoolById/:id', verifyToken, function (req, res) {
  if(res.locals.decoded.userType === 'Admin'){
    let id = req.params.id;
    School.findById(id, function (err, school){
      if(err){
        res.status(200).json({
          resType: 'failed',
          message: 'Error'
        });
      }
      else {
        res.status(200).json({
          resType: 'success',
          message: '',
          school: school
        });
      }
    });
  }
  else{
    res.status(200).json({
      resType: 'failed',
      message: 'you have no permission'
    });
  }
  
});

//  Defined update route
router.post('/api/updateSchoolById/:id', verifyToken, upload.single('image'), function (req, res) {
  if(res.locals.decoded.userType === 'Admin'){
    School.findById(req.params.id, function(err, school) {
      if (!school){
        res.status(200).json({
          resType: 'failed',
          message: 'No data found'
        });
      }
      else {
        school.schoolCode = req.body.schoolCode;
        school.schoolName = req.body.schoolName;
        school.email = req.body.email;
        school.contactNo = req.body.contactNo;
        school.Address = req.body.Address;
        if(req.file){
          school.schoolLogo = req.file.filename;
        }
  
        school.save().then(school => {
          res.status(200).json({
            resType: 'success',
            message: 'school updated'
          });
        })
        .catch(err => {
          res.status(200).json({
            resType: 'failed',
            message: 'unable to update the database'
          });
        });
      }
    });
  }
  else{
    res.status(200).json({
      resType: 'failed',
      message: 'you have no permission'
    });
  }
 
});

router.delete('/api/deleteSchool/:id',verifyToken, function(req,res){
  if(res.locals.decoded.userType === 'Admin'){
    School.findByIdAndRemove({_id: req.params.id}, function(err, business){
      if(err) res.status(200).json({
        resType: 'failed',
        message: 'unable to delete the school'
      });
      else res.json({
        resType: 'success',
        message: 'school removed'
      });
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
