var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
const cors = require('cors');

var jwt = require('jsonwebtoken');
var config = require('../config');

// Require feetype model in our routes module

const StudentCharge = require('../model/account/studentCharge.model');

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

router.post('/api/SaveStudentCharge', verifyToken, async (req,res, next) => {
  
  if(res.locals.decoded.userType === 'Admin'){
    let data = req.body;

    let studentCharge = new StudentCharge(data);

    await studentCharge.save();

    res.status(200).json({
      resType: 'success',
      message: ' Student Charge saved',
      studentCharge: studentCharge
    });

  }
  else{
    req.status = 200;
    const error = new Error("you have no permission.");
    next(error);
  }
});

router.get('/api/getStudentCharge', verifyToken, async (req,res, next) => {
  if(res.locals.decoded.userType === 'Admin'){

    const studentCharge = await StudentCharge.find().populate("classId studentId feeTypeId").exec();

      res.status(200).json({
        resType: 'success',
        studentCharge: studentCharge
      });
      
  }
  else{
    req.status = 200;
    const error = new Error("you have no permission.");
    next(error);
   }
});

// Defined edit route
router.get('/api/getStudentChargeById/:id', verifyToken, async (req, res, next) => {
  if(res.locals.decoded.userType === 'Admin'){
    let id = req.params.id;

    const studentCharge = await StudentCharge.findById(id);

    res.status(200).json({
      resType: 'success',
      message: '',
      studentCharge: studentCharge
    });

  }
  else{
    req.status = 200;
    const error = new Error("you have no permission.");
    next(error);
  }
  
});

//  Defined update route
router.post('/api/updateStudentChargeById/:id', verifyToken, async (req, res, next) => {
  if(res.locals.decoded.userType === 'Admin'){

    const studentCharge = await StudentCharge.findById(req.params.id);

    studentCharge.classId = req.body.classId;
    studentCharge.studentId = req.body.studentId;
    studentCharge.feeTypeId = req.body.feeTypeId;
    studentCharge.Amount = req.body.Amount;
    studentCharge.Date = req.body.Date;
    studentCharge.Remark = req.body.Remark;

    await studentCharge.save();

    res.status(200).json({
      resType: 'success',
      message: 'student Charge updated',
      studentCharge: studentCharge
    });

  }
  else{
    req.status = 200;
    const error = new Error("you have no permission.");
    next(error);
  }
 
});

router.delete('/api/deleteStudentCharge/:id',verifyToken, async (req, res, next) => {
  if(res.locals.decoded.userType === 'Admin'){
    
    const studentCharge = await StudentCharge.findByIdAndRemove({_id: req.params.id});
    
    res.status(200).json({
      resType: 'success',
      message: 'Student Charge removed',
      studentCharge: studentCharge
    });

  }
  else{
    req.status = 200;
    const error = new Error("you have no permission.");
    next(error);
  }
});

module.exports = router;
