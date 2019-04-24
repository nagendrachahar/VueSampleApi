var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
const cors = require('cors');

var jwt = require('jsonwebtoken');
var config = require('../config');

// Require feetype model in our routes module

const FeeSetup = require('../model/account/feeSetup.model');

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

router.post('/api/SaveFeeSetup', verifyToken, async (req,res, next) => {
  
  if(res.locals.decoded.userType === 'Admin'){
    let data = req.body;

    let feeSetup = new FeeSetup(data);

    await feeSetup.save();

    res.status(200).json({
      resType: 'success',
      message: ' fee Setup saved',
      feeSetup: feeSetup
    });

  }
  else{
    req.status = 200;
    const error = new Error("you have no permission.");
    next(error);
  }
});

router.get('/api/getFeeSetup', verifyToken, async (req,res, next) => {
  if(res.locals.decoded.userType === 'Admin'){

    const feeSetup = await FeeSetup.find().populate("classId feeTypeId").exec();

      res.status(200).json({
        resType: 'success',
        feeSetup: feeSetup
      });
      
  }
  else{
    req.status = 200;
    const error = new Error("you have no permission.");
    next(error);
   }
});

// Defined edit route
router.get('/api/getFeeSetupById/:id', verifyToken, async (req, res, next) => {
  if(res.locals.decoded.userType === 'Admin'){
    let id = req.params.id;

    const feeSetup = await FeeSetup.findById(id);

    res.status(200).json({
      resType: 'success',
      message: '',
      feeSetup: feeSetup
    });

  }
  else{
    req.status = 200;
    const error = new Error("you have no permission.");
    next(error);
  }
  
});

//  Defined update route
router.post('/api/updateFeeSetupById/:id', verifyToken, async (req, res, next) => {
  if(res.locals.decoded.userType === 'Admin'){

    const feeSetup = await FeeSetup.findById(req.params.id);

    feeSetup.classId = req.body.classId;
    feeSetup.feeTypeId = req.body.feeTypeId;
    feeSetup.Fee = req.body.Fee;
    feeSetup.feeDate = req.body.feeDate;
    feeSetup.Fine = req.body.Fine;
    feeSetup.Remark = req.body.Remark;

    await feeSetup.save();

    res.status(200).json({
      resType: 'success',
      message: 'feeType updated',
      feeSetup: feeSetup
    });

  }
  else{
    req.status = 200;
    const error = new Error("you have no permission.");
    next(error);
  }
 
});

// defined delete route
router.delete('/api/deleteFeeSetup/:id',verifyToken, async (req, res, next) => {
  if(res.locals.decoded.userType === 'Admin'){
    
    const feeSetup = await FeeSetup.findByIdAndRemove({_id: req.params.id});
    
    res.status(200).json({
      resType: 'success',
      message: 'feeSetup removed',
      feeSetup: feeSetup
    });

  }
  else{
    req.status = 200;
    const error = new Error("you have no permission.");
    next(error);
  }
});


// get fee by class and feeType 
router.get('/api/getFeeChargeById/:classId&:typeId', verifyToken, async (req, res, next) => {
  if(res.locals.decoded.userType === 'Admin'){

    const feeSetup = await FeeSetup.find({classId:req.params.classId, feeTypeId:req.params.typeId});

    res.status(200).json({
      resType: 'success',
      message: '',
      feeSetup: feeSetup
    });

  }
  else{
    req.status = 200;
    const error = new Error("you have no permission.");
    next(error);
  }
  
});

module.exports = router;
